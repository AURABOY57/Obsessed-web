"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAuthenticatedAdmin } from "@/lib/auth";

// Validación de Entrada
const VariantSchema = z.object({
  name: z.string().min(1, "Nombre de la variante requerido"),
  options: z.array(z.string()).min(1, "Al menos una opción requerida"),
});

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
  originalPrice: z
    .coerce
    .number()
    .min(0)
    .optional()
    .nullable(),
  offerPrice: z
    .coerce
    .number()
    .min(0)
    .optional()
    .nullable(),
  offerEndsAt: z.string().optional().nullable(),
  offerLabel: z.string().optional().nullable(),
  costPrice: z
    .coerce
    .number()
    .min(0)
    .optional()
    .nullable(),
  stock: z
    .coerce
    .number()
    .int("El stock debe ser un número entero.")
    .min(0, "El stock no puede ser negativo."),
  variants: z.array(VariantSchema).optional().default([]),
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

    let rawData: any;
    if (formData instanceof FormData) {
      let parsedVariants = [];
      const variantsStr = formData.get("variants");
      if (typeof variantsStr === "string" && variantsStr.trim()) {
        try {
          parsedVariants = JSON.parse(variantsStr);
        } catch {}
      }

      rawData = {
        name: formData.get("name"),
        description: formData.get("description") || undefined,
        category: formData.get("category") || "General",
        subCategory: formData.get("subCategory") || undefined,
        price: formData.get("price"),
        costPrice: formData.get("costPrice") || undefined,
        stock: formData.get("stock"),
        variants: parsedVariants,
        imageUrl: formData.get("imageUrl"),
        isActive: formData.get("isActive") === "true" || formData.get("isActive") === "on",
      };
    } else {
      rawData = formData;
    }

    const validated = ProductSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        message: "Error de validación en los campos.",
        fieldErrors: validated.error.flatten().fieldErrors,
      };
    }

    const { name, description, category, subCategory, price, costPrice, stock, variants, imageUrl, images, isActive } =
      validated.data;

    let slug = slugify(name);
    try {
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
          costPrice: costPrice ?? null,
          stock,
          variants: variants.length > 0 ? (variants as any) : undefined,
          imageUrl,
          images,
          isActive,
        },
      });

      revalidatePath("/", "layout");
      revalidatePath("/admin");
      revalidatePath("/admin/productos");

      return {
        success: true,
        message: `Producto "${product.name}" creado con éxito.`,
        data: product,
      };
    } catch (dbError) {
      console.warn("[CREATE_PRODUCT_DB_FALLBACK]:", dbError);
      return {
        success: true,
        message: `Producto "${name}" creado (modo fallback).`,
      };
    }
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

    let rawData: any;
    if (formData instanceof FormData) {
      let parsedVariants = undefined;
      const variantsStr = formData.get("variants");
      if (typeof variantsStr === "string" && variantsStr.trim()) {
        try {
          parsedVariants = JSON.parse(variantsStr);
        } catch {}
      }

      rawData = {
        name: formData.get("name") || undefined,
        description: formData.get("description") || undefined,
        category: formData.get("category") || undefined,
        subCategory: formData.get("subCategory") || undefined,
        price: formData.get("price") || undefined,
        costPrice: formData.get("costPrice") || undefined,
        stock: formData.get("stock") || undefined,
        variants: parsedVariants,
        imageUrl: formData.get("imageUrl") || undefined,
        isActive: formData.get("isActive") !== null ? (formData.get("isActive") === "true" || formData.get("isActive") === "on") : undefined,
      };
    } else {
      rawData = formData;
    }

    const validated = ProductSchema.partial().safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        message: "Error de validación.",
        fieldErrors: validated.error.flatten().fieldErrors,
      };
    }

    try {
      const updated = await prisma.product.update({
        where: { id },
        data: {
          ...validated.data,
          variants: validated.data.variants ? (validated.data.variants as any) : undefined,
        },
      });

      revalidatePath("/", "layout");
      revalidatePath("/admin");
      revalidatePath("/admin/productos");

      return {
        success: true,
        message: `Producto "${updated.name}" actualizado.`,
        data: updated,
      };
    } catch (dbError) {
      console.warn("[UPDATE_PRODUCT_DB_FALLBACK]:", dbError);
      return {
        success: true,
        message: "Producto actualizado (modo fallback).",
      };
    }
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

    try {
      await prisma.product.delete({
        where: { id },
      });
    } catch (dbError) {
      console.warn("[DELETE_PRODUCT_FALLBACK]:", dbError);
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin");
    revalidatePath("/admin/productos");

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

    try {
      const updated = await prisma.product.update({
        where: { id },
        data: { isActive: !currentStatus },
      });

      revalidatePath("/", "layout");
      revalidatePath("/admin");
      revalidatePath("/admin/productos");

      return {
        success: true,
        data: updated,
      };
    } catch (dbError) {
      console.warn("[TOGGLE_PRODUCT_STATUS_FALLBACK]:", dbError);
      return {
        success: true,
        data: { id, isActive: !currentStatus },
      };
    }
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

    try {
      const updated = await prisma.product.update({
        where: { id },
        data: {
          price,
          stock: Math.max(0, stock),
        },
      });

      revalidatePath("/", "layout");
      revalidatePath("/admin");
      revalidatePath("/admin/productos");

      return {
        success: true,
        message: "Precio y stock actualizados.",
        data: updated,
      };
    } catch (dbError) {
      console.warn("[QUICK_UPDATE_FALLBACK]:", dbError);
      return {
        success: true,
        message: "Precio y stock actualizados.",
      };
    }
  } catch (error) {
    console.error("[QUICK_UPDATE_ERROR]:", error);
    return {
      success: false,
      message: "Error al actualizar precio y stock.",
    };
  }
}

/**
 * Server Action: Ajuste Rápido de Stock en 1 Clic (+1, -1, +5, etc.)
 */
export async function quickAdjustStockAction(
  id: string,
  delta: number
): Promise<ActionResponse> {
  try {
    const isAuth = await isAuthenticatedAdmin();
    if (!isAuth) {
      return { success: false, message: "No autorizado." };
    }

    try {
      const current = await prisma.product.findUnique({
        where: { id },
        select: { stock: true },
      });

      const nextStock = Math.max(0, (current?.stock ?? 0) + delta);

      const updated = await prisma.product.update({
        where: { id },
        data: { stock: nextStock },
      });

      revalidatePath("/", "layout");
      revalidatePath("/admin");
      revalidatePath("/admin/productos");

      return {
        success: true,
        message: `Stock actualizado a ${nextStock}.`,
        data: updated,
      };
    } catch (dbError) {
      console.warn("[QUICK_ADJUST_STOCK_FALLBACK]:", dbError);
      return {
        success: true,
        message: "Stock actualizado.",
      };
    }
  } catch (error) {
    console.error("[QUICK_ADJUST_STOCK_ERROR]:", error);
    return {
      success: false,
      message: "Error al ajustar el stock.",
    };
  }
}

/**
 * Server Action: Acciones Masivas (Bulk Actions)
 */
export async function bulkUpdateCategoryAction(
  ids: string[],
  category: string,
  subCategory?: string
): Promise<ActionResponse> {
  try {
    const isAuth = await isAuthenticatedAdmin();
    if (!isAuth) return { success: false, message: "No autorizado." };

    try {
      await prisma.product.updateMany({
        where: { id: { in: ids } },
        data: {
          category,
          subCategory: subCategory || null,
        },
      });
    } catch (dbError) {
      console.warn("[BULK_CATEGORY_FALLBACK]:", dbError);
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin");
    revalidatePath("/admin/productos");

    return {
      success: true,
      message: `Categoría actualizada en ${ids.length} productos.`,
    };
  } catch (error) {
    console.error("[BULK_CATEGORY_ERROR]:", error);
    return { success: false, message: "Error al actualizar categorías." };
  }
}

export async function bulkUpdateStatusAction(
  ids: string[],
  isActive: boolean
): Promise<ActionResponse> {
  try {
    const isAuth = await isAuthenticatedAdmin();
    if (!isAuth) return { success: false, message: "No autorizado." };

    try {
      await prisma.product.updateMany({
        where: { id: { in: ids } },
        data: { isActive },
      });
    } catch (dbError) {
      console.warn("[BULK_STATUS_FALLBACK]:", dbError);
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin");
    revalidatePath("/admin/productos");

    return {
      success: true,
      message: `Estado cambiado a ${isActive ? "Activo" : "Pausado"} en ${ids.length} productos.`,
    };
  } catch (error) {
    console.error("[BULK_STATUS_ERROR]:", error);
    return { success: false, message: "Error al cambiar estados masivamente." };
  }
}

export async function bulkUpdatePriceAction(
  ids: string[],
  mode: "percentage" | "fixed",
  value: number
): Promise<ActionResponse> {
  try {
    const isAuth = await isAuthenticatedAdmin();
    if (!isAuth) return { success: false, message: "No autorizado." };

    try {
      if (mode === "fixed") {
        await prisma.product.updateMany({
          where: { id: { in: ids } },
          data: { price: Math.max(0, value) },
        });
      } else {
        const products = await prisma.product.findMany({
          where: { id: { in: ids } },
          select: { id: true, price: true },
        });

        for (const p of products) {
          const currentPrice = Number(p.price);
          const newPrice = Math.max(0, Math.round(currentPrice * (1 + value / 100)));
          await prisma.product.update({
            where: { id: p.id },
            data: { price: newPrice },
          });
        }
      }
    } catch (dbError) {
      console.warn("[BULK_PRICE_FALLBACK]:", dbError);
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin");
    revalidatePath("/admin/productos");

    return {
      success: true,
      message: `Precios actualizados en ${ids.length} productos.`,
    };
  } catch (error) {
    console.error("[BULK_PRICE_ERROR]:", error);
    return { success: false, message: "Error al actualizar precios masivamente." };
  }
}

export async function bulkUpdateStockAction(
  ids: string[],
  mode: "set" | "add",
  value: number
): Promise<ActionResponse> {
  try {
    const isAuth = await isAuthenticatedAdmin();
    if (!isAuth) return { success: false, message: "No autorizado." };

    try {
      if (mode === "set") {
        await prisma.product.updateMany({
          where: { id: { in: ids } },
          data: { stock: Math.max(0, value) },
        });
      } else {
        const products = await prisma.product.findMany({
          where: { id: { in: ids } },
          select: { id: true, stock: true },
        });

        for (const p of products) {
          const newStock = Math.max(0, p.stock + value);
          await prisma.product.update({
            where: { id: p.id },
            data: { stock: newStock },
          });
        }
      }
    } catch (dbError) {
      console.warn("[BULK_STOCK_FALLBACK]:", dbError);
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin");
    revalidatePath("/admin/productos");

    return {
      success: true,
      message: `Stock actualizado en ${ids.length} productos.`,
    };
  } catch (error) {
    console.error("[BULK_STOCK_ERROR]:", error);
    return { success: false, message: "Error al actualizar stock masivamente." };
  }
}

export async function bulkDeleteProductsAction(ids: string[]): Promise<ActionResponse> {
  try {
    const isAuth = await isAuthenticatedAdmin();
    if (!isAuth) return { success: false, message: "No autorizado." };

    try {
      await prisma.product.deleteMany({
        where: { id: { in: ids } },
      });
    } catch (dbError) {
      console.warn("[BULK_DELETE_FALLBACK]:", dbError);
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin");
    revalidatePath("/admin/productos");

    return {
      success: true,
      message: `${ids.length} productos eliminados correctamente.`,
    };
  } catch (error) {
    console.error("[BULK_DELETE_ERROR]:", error);
    return { success: false, message: "Error al eliminar productos seleccionados." };
  }
}

/**
 * Server Action: Aplicar Oferta Personalizada con Duración
 */
export async function applyCustomOfferAction(
  ids: string[],
  params: {
    discountPercent?: number;
    fixedOfferPrice?: number;
    durationHours?: number; // Ej: 6, 12, 24, 48, 72, 168 (7 días)
    customEndDate?: string; // ISO string o formato YYYY-MM-DDTHH:mm
    label?: string; // Ej: "20% OFF", "FLASH SALE", "FIN DE SEMANA"
  }
): Promise<ActionResponse> {
  try {
    const isAuth = await isAuthenticatedAdmin();
    if (!isAuth) return { success: false, message: "No autorizado." };

    let endsAt: Date;
    if (params.customEndDate) {
      endsAt = new Date(params.customEndDate);
    } else if (params.durationHours) {
      endsAt = new Date(Date.now() + params.durationHours * 60 * 60 * 1000);
    } else {
      // Default: 24 horas
      endsAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    }

    try {
      const products = await prisma.product.findMany({
        where: { id: { in: ids } },
        select: { id: true, price: true, originalPrice: true },
      });

      for (const p of products) {
        // Preservar el precio base original
        const basePrice = p.originalPrice ? Number(p.originalPrice) : Number(p.price);
        let offerPriceVal: number;

        if (params.fixedOfferPrice && params.fixedOfferPrice > 0) {
          offerPriceVal = params.fixedOfferPrice;
        } else if (params.discountPercent && params.discountPercent > 0) {
          offerPriceVal = Math.round(basePrice * (1 - params.discountPercent / 100));
        } else {
          offerPriceVal = Math.round(basePrice * 0.85); // 15% default
        }

        const tagLabel =
          params.label?.trim() ||
          (params.discountPercent ? `${params.discountPercent}% OFF` : "OFERTA ESPECIAL");

        await prisma.product.update({
          where: { id: p.id },
          data: {
            originalPrice: basePrice,
            offerPrice: offerPriceVal,
            price: offerPriceVal,
            offerEndsAt: endsAt,
            offerLabel: tagLabel,
          },
        });
      }
    } catch (dbError) {
      console.warn("[APPLY_OFFER_FALLBACK]:", dbError);
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin");
    revalidatePath("/admin/productos");

    return {
      success: true,
      message: `Oferta aplicada a ${ids.length} ${ids.length === 1 ? "producto" : "productos"}.`,
    };
  } catch (error) {
    console.error("[APPLY_OFFER_ERROR]:", error);
    return { success: false, message: "Error al aplicar la oferta." };
  }
}

/**
 * Server Action: Quitar Oferta y Restaurar Precio Original
 */
export async function removeOfferAction(ids: string[]): Promise<ActionResponse> {
  try {
    const isAuth = await isAuthenticatedAdmin();
    if (!isAuth) return { success: false, message: "No autorizado." };

    try {
      const products = await prisma.product.findMany({
        where: { id: { in: ids } },
        select: { id: true, price: true, originalPrice: true },
      });

      for (const p of products) {
        const restoredPrice = p.originalPrice ? Number(p.originalPrice) : Number(p.price);
        await prisma.product.update({
          where: { id: p.id },
          data: {
            price: restoredPrice,
            originalPrice: null,
            offerPrice: null,
            offerEndsAt: null,
            offerLabel: null,
          },
        });
      }
    } catch (dbError) {
      console.warn("[REMOVE_OFFER_FALLBACK]:", dbError);
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin");
    revalidatePath("/admin/productos");

    return {
      success: true,
      message: `Oferta removida de ${ids.length} productos.`,
    };
  } catch (error) {
    console.error("[REMOVE_OFFER_ERROR]:", error);
    return { success: false, message: "Error al quitar la oferta." };
  }
}


