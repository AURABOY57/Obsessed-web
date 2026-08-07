import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { QuickProductRow } from "@/components/admin/QuickProductRow";
import { PlusCircle } from "lucide-react";

export const dynamic = "force-dynamic";

interface AdminProductItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  imageUrl: string;
  isActive: boolean;
  category?: string | null;
  subCategory?: string | null;
}

const DEMO_PRODUCTS: AdminProductItem[] = [
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
  },
  {
    id: "demo-2",
    name: "Mate Torpedo Cuero Seleccionado",
    slug: "mate-torpedo-cuero-seleccionado",
    price: 42000,
    stock: 6,
    imageUrl: "/images/products/mate-torpedo-cuero.png",
    isActive: true,
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
    subCategory: "Alpaca Maciza",
  },
];

export default async function AdminProductsPage() {
  let products: AdminProductItem[] = DEMO_PRODUCTS;

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
      }));
    }
  } catch (err) {
    console.warn("[ADMIN_PRODUCTS_DB_FALLBACK]:", err);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-widest font-mono text-brand-black">
            Inventario de Productos
          </h1>
          <p className="text-xs font-mono text-brand-muted mt-1">
            Total: {products.length} productos registrados
          </p>
        </div>

        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center justify-center gap-2 bg-brand-black text-brand-white px-4 py-2 text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 transition-colors border border-brand-black"
        >
          <PlusCircle size={14} />
          <span>+ Nuevo Producto</span>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="border border-dashed border-brand-border p-12 text-center space-y-3">
          <p className="text-xs font-mono text-brand-muted">
            Aún no tienes productos creados.
          </p>
          <Link
            href="/admin/productos/nuevo"
            className="inline-block text-xs font-mono uppercase tracking-wider text-brand-black underline"
          >
            Agregar el primer producto
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((product) => (
            <QuickProductRow key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
