import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = params;

  let product: any = null;

  try {
    const dbProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (dbProduct) {
      product = {
        id: dbProduct.id,
        name: dbProduct.name,
        description: dbProduct.description,
        category: dbProduct.category,
        subCategory: dbProduct.subCategory,
        price: Number(dbProduct.price),
        costPrice: dbProduct.costPrice ? Number(dbProduct.costPrice) : null,
        stock: dbProduct.stock,
        variants: dbProduct.variants,
        imageUrl: dbProduct.imageUrl,
        isActive: dbProduct.isActive,
      };
    }
  } catch (error) {
    console.warn("[EDIT_PRODUCT_DB_FALLBACK]:", error);
  }

  // Fallback para demo si no existe en BD
  if (!product && id.startsWith("demo-")) {
    product = {
      id,
      name: "Mate Imperial Premium Noir",
      description: "Calabaza seleccionada forrada en cuero vacuno.",
      category: "Mates",
      subCategory: "Imperial",
      price: 48000,
      costPrice: 28000,
      stock: 8,
      variants: [{ name: "Virola", options: ["Lisa", "Cincelada"] }],
      imageUrl: "/images/products/mate-imperial-noir.png",
      isActive: true,
    };
  }

  if (!product) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/productos"
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-brand-muted hover:text-brand-black transition-colors"
        >
          <ArrowLeft size={13} />
          <span>Volver al inventario</span>
        </Link>
        <div className="border border-brand-border p-8 text-center space-y-2">
          <p className="text-sm font-mono text-brand-black">Producto no encontrado.</p>
          <Link href="/admin/productos" className="text-xs font-mono underline text-brand-muted">
            Ir a la lista de productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-brand-border pb-4">
        <Link
          href="/admin/productos"
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-brand-muted hover:text-brand-black transition-colors mb-3"
        >
          <ArrowLeft size={13} />
          <span>Volver al inventario</span>
        </Link>
        <h1 className="text-xl font-bold uppercase tracking-widest font-mono text-brand-black">
          Editar Producto
        </h1>
        <p className="text-xs font-mono text-brand-muted mt-1">
          Modifica fotos, precios, variantes o stock disponible.
        </p>
      </div>

      <ProductForm initialData={product} />
    </div>
  );
}
