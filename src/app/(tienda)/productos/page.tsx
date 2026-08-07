import React from "react";
import { prisma } from "@/lib/prisma";
import { CatalogView, ProductItem } from "@/components/shop/CatalogView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Catálogo Completo | Mates, Bombillas, Termos | obsessed.cba",
  description: "Explora la colección completa de mates imperiales, torpedos, bombillas de alpaca y termos con filtros por categoría y stock disponible.",
};

const DEMO_PRODUCTS: ProductItem[] = [
  {
    id: "demo-1",
    name: "Mate Imperial Premium Noir",
    slug: "mate-imperial-premium-noir",
    price: 48000,
    stock: 8,
    imageUrl: "/images/products/mate-imperial-noir.png",
    category: "Mates",
    subCategory: "Imperial",
  },
  {
    id: "demo-2",
    name: "Mate Torpedo Cuero Seleccionado",
    slug: "mate-torpedo-cuero-seleccionado",
    price: 42000,
    stock: 6,
    imageUrl: "/images/products/mate-torpedo-cuero.png",
    category: "Mates",
    subCategory: "Torpedo",
  },
  {
    id: "demo-3",
    name: "Termo Obsidian Matte 1L",
    slug: "termo-obsidian-matte-1l",
    price: 68000,
    stock: 10,
    imageUrl: "/images/products/termo-obsidian-black.png",
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
    category: "Bombillas",
    subCategory: "Alpaca Maciza",
  },
];

export default async function ProductsCatalogPage() {
  let products: ProductItem[] = DEMO_PRODUCTS;

  try {
    const dbProducts = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (dbProducts.length > 0) {
      products = dbProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        stock: p.stock,
        imageUrl: p.imageUrl,
        category: p.category || "Mates",
        subCategory: p.subCategory || null,
      }));
    }
  } catch (error) {
    console.warn("[PRODUCTS_CATALOG_DB]: Usando demo", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      {/* Encabezado Editorial */}
      <div className="border-b border-brand-border pb-6 space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-brand-muted">
          Catálogo Oficial • obsessed.cba
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-widest font-mono text-brand-black">
          Colección de Mates & Accesorios
        </h1>
        <p className="text-xs font-mono text-brand-muted max-w-xl leading-relaxed">
          Filtra por categoría (Mates, Bombillas, Termos, Accesorios), busca modelos específicos o consulta piezas con stock disponible para envío inmediato.
        </p>
      </div>

      {/* Vista Interactiva con Filtros */}
      <CatalogView initialProducts={products} />
    </div>
  );
}
