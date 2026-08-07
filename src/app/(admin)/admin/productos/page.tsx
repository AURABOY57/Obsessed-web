import React from "react";
import { prisma } from "@/lib/prisma";
import { ProductInventoryView, InventoryProduct } from "@/components/admin/ProductInventoryView";

export const dynamic = "force-dynamic";

const DEMO_PRODUCTS: InventoryProduct[] = [
  {
    id: "demo-1",
    name: "Mate Imperial Premium Noir",
    slug: "mate-imperial-premium-noir",
    price: 48000,
    stock: 8,
    imageUrl: "/images/products/mate-imperial-noir.png",
    isActive: true,
    category: "Mates",
    subCategory: "Imperial",
    variants: [{ name: "Virola", options: ["Lisa", "Cincelada"] }],
  },
  {
    id: "demo-2",
    name: "Mate Torpedo Cuero Seleccionado",
    slug: "mate-torpedo-cuero-seleccionado",
    price: 42000,
    stock: 1, // Alerta stock bajo (< 2)
    imageUrl: "/images/products/mate-torpedo-cuero.png",
    isActive: true,
    category: "Mates",
    subCategory: "Torpedo",
    variants: [{ name: "Color", options: ["Negro", "Marrón"] }],
  },
  {
    id: "demo-3",
    name: "Termo Obsidian Matte 1L",
    slug: "termo-obsidian-matte-1l",
    price: 68000,
    stock: 0, // Alerta stock bajo (< 2)
    imageUrl: "/images/products/termo-obsidian-black.png",
    isActive: true,
    category: "Termos",
    subCategory: "Acero Inox",
  },
  {
    id: "demo-4",
    name: "Bombilla Pico de Loro Alpaca Cincelada",
    slug: "bombilla-pico-de-loro-alpaca-cincelada",
    price: 18500,
    stock: 15,
    imageUrl: "/images/products/bombilla-alpaca-pico.png",
    isActive: true,
    category: "Bombillas",
    subCategory: "Alpaca",
  },
];

interface AdminProductsPageProps {
  searchParams?: {
    filter?: string;
  };
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  let products: InventoryProduct[] = DEMO_PRODUCTS;

  try {
    const data = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (data.length > 0) {
      products = data.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        stock: p.stock,
        imageUrl: p.imageUrl,
        isActive: p.isActive,
        category: p.category,
        subCategory: p.subCategory,
        variants: p.variants,
      }));
    }
  } catch (err) {
    console.warn("[ADMIN_PRODUCTS_DB_FALLBACK]:", err);
  }

  return (
    <ProductInventoryView
      initialProducts={products}
      initialFilter={searchParams?.filter}
    />
  );
}
