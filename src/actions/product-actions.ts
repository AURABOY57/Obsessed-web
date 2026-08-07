"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAuthenticatedAdmin } from "@/lib/auth";

// Validación de Entrada
const ProductSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(100, "El nombre no puede exceder los 100 caracteres."),
  slug: z.string().optional(),
  description: z.string().optional().default(""),
  category: z.string().optional().default("General"),
  subCategory: z.string().optional().default(""),
  price: z
    .coerce
    .number()
    .positive("El precio debe ser un valor positivo mayor a 0."),
  stock: z
    .coerce
    .number()
    .int("El stock debe ser un número entero.")
    .min(0, "El stock no puede ser negativo."),
  imageUrl: z
    .string()
    .min(1, "La imagen principal es obligatoria."),
  images: z.array(z.string()).optional().default([]),
  isActive: z.boolean().optional().default(true),
});

export type ProductInput = z.infer<typeof ProductSchema>;

export type ActionResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  fieldErrors?: Record<string, string[]>;
};

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Server Action: Crear Producto
 */
export async function createProductAction(
  formData: ProductInput | FormData
): Promise<ActionResponse> {
  try {
    const isAuth = await isAuthenticatedAdmin();
    if (!isAuth) {
      return { success: false, message: "No autorizado. Inicia sesión como administrador." };
    }

    const rawData =
      formData instanceof FormData
        ? {
            name: formData.get("name"),
            description: formData.get("description") || undefined,
            category: formData.get("category") || "General",
            subCategory: formData.get("subCategory") || undefined,
            price: formData.get("price"),
            stock: formData.get("stock"),
            imageUrl: formData.get("imageUrl"),
            isActive: formData.get("isActive") === "true" || formData.get("isActive") === "on",
          }
        : formData;

    const validated = ProductSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        message: "Error de validación en los campos.",
        fieldErrors: validated.error.flatten().fieldErrors,
      };
    }

    const { name, description, category, subCategory, price, stock, imageUrl, images, isActive } =
      validated.data;

    let slug = slugify(name);
    const existing = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        category,
        subCategory: subCategory || null,
        price,
        stock,
        imageUrl,
        images,
        isActive,
      },
    });

    revalidatePath("/", "layout");

    return {
      success: true,
      message: `Producto "${product.name}" creado con éxito.`,
      data: product,
    };
  } catch (error) {
    console.error("[CREATE_PRODUCT_ERROR]:", error);
    return {
      success: false,
      message: "Error al guardar el producto en la base de datos.",
    };
  }
}

/**
 * Server Action: Actualizar Producto
 */
export async function updateProductAction(
  id: string,
  formData: Partial<ProductInput> | FormData
): Promise<ActionResponse> {
  try {
    const isAuth = await isAuthenticatedAdmin();
    if (!isAuth) {
      return { success: false, message: "No autorizado." };
    }

    const rawData =
      formData instanceof FormData
        ? {
            name: formData.get("name"),
            description: formData.get("description") || undefined,
            category: formData.get("category") || "General",
            subCategory: formData.get("subCategory") || undefined,
            price: formData.get("price"),
            stock: formData.get("stock"),
            imageUrl: formData.get("imageUrl"),
            isActive: formData.get("isActive") === "true" || formData.get("isActive") === "on",
          }
        : formData;

    const validated = ProductSchema.partial().safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        message: "Error de validación.",
        fieldErrors: validated.error.flatten().fieldErrors,
      };
    }

    const updated = await prisma.product.update({
      where: { id },
      data: validated.data,
    });

    revalidatePath("/", "layout");

    return {
      success: true,
      message: `Producto "${updated.name}" actualizado.`,
      data: updated,
    };
  } catch (error) {
    console.error("[UPDATE_PRODUCT_ERROR]:", error);
    return {
      success: false,
      message: "Error al actualizar el producto.",
    };
  }
}

/**
 * Server Action: Eliminar Producto
 */
export async function deleteProductAction(id: string): Promise<ActionResponse> {
  try {
    const isAuth = await isAuthenticatedAdmin();
    if (!isAuth) {
      return { success: false, message: "No autorizado." };
    }

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/", "layout");

    return {
      success: true,
      message: "Producto eliminado correctamente.",
    };
  } catch (error) {
    console.error("[DELETE_PRODUCT_ERROR]:", error);
    return {
      success: false,
      message: "Error al eliminar el producto.",
    };
  }
}

/**
 * Server Action: Alternar Estado Activo / Inactivo
 */
export async function toggleProductStatusAction(
  id: string,
  currentStatus: boolean
): Promise<ActionResponse> {
  try {
    const isAuth = await isAuthenticatedAdmin();
    if (!isAuth) {
      return { success: false, message: "No autorizado." };
    }

    const updated = await prisma.product.update({
      where: { id },
      data: { isActive: !currentStatus },
    });

    revalidatePath("/", "layout");

    return {
      success: true,
      data: updated,
    };
  } catch (error) {
    console.error("[TOGGLE_PRODUCT_STATUS_ERROR]:", error);
    return {
      success: false,
      message: "Error al cambiar el estado del producto.",
    };
  }
}

/**
 * Server Action: Actualización Rápida de Stock y Precio desde Móvil/PC
 */
export async function quickUpdateProductAction(
  id: string,
  price: number,
  stock: number
): Promise<ActionResponse> {
  try {
    const isAuth = await isAuthenticatedAdmin();
    if (!isAuth) {
      return { success: false, message: "No autorizado." };
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        price,
        stock,
      },
    });

    revalidatePath("/", "layout");

    return {
      success: true,
      message: "Precio y stock actualizados.",
      data: updated,
    };
  } catch (error) {
    console.error("[QUICK_UPDATE_ERROR]:", error);
    return {
      success: false,
      message: "Error al actualizar precio y stock.",
    };
  }
}
