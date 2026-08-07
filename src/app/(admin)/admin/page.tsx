import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { QuickProductRow } from "@/components/admin/QuickProductRow";
import { Package, PlusCircle, AlertCircle, ShoppingBag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Obtener datos directamente en Server Component
  let totalProducts = 0;
  let activeProducts = 0;
  let lowStockProducts = 0;
  let recentProducts: Array<{
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    imageUrl: string;
    isActive: boolean;
    category: string | null;
  }> = [];

  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    totalProducts = products.length;
    activeProducts = products.filter((p) => p.isActive).length;
    lowStockProducts = products.filter((p) => p.stock <= 2).length;

    recentProducts = products.slice(0, 5).map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      stock: p.stock,
      imageUrl: p.imageUrl,
      isActive: p.isActive,
      category: p.category,
    }));
  } catch (error) {
    console.error("[DASHBOARD_DB_ERROR]:", error);
  }

  return (
    <div className="space-y-8">
      {/* Encabezado y Acción Primaria */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-widest font-mono text-brand-black">
            Panel de Control
          </h1>
          <p className="text-xs font-mono text-brand-muted mt-1">
            Gestión rápida de stock, precios y catálogo de obsessed.cba
          </p>
        </div>

        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center justify-center gap-2 bg-brand-black text-brand-white px-5 py-2.5 text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 transition-colors border border-brand-black"
        >
          <PlusCircle size={15} />
          <span>+ Cargar Producto</span>
        </Link>
      </div>

      {/* Métricas Resumen Geométricas */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="border border-brand-border p-4 bg-brand-white space-y-1">
          <div className="flex items-center justify-between text-brand-muted">
            <span className="text-[11px] font-mono uppercase tracking-wider">Total Productos</span>
            <Package size={16} />
          </div>
          <p className="text-2xl font-bold font-mono text-brand-black">{totalProducts}</p>
        </div>

        <div className="border border-brand-border p-4 bg-brand-white space-y-1">
          <div className="flex items-center justify-between text-brand-muted">
            <span className="text-[11px] font-mono uppercase tracking-wider">Activos en Tienda</span>
            <ShoppingBag size={16} />
          </div>
          <p className="text-2xl font-bold font-mono text-brand-black">{activeProducts}</p>
        </div>

        <div className="border border-brand-border p-4 bg-brand-white col-span-2 md:col-span-1 space-y-1">
          <div className="flex items-center justify-between text-brand-muted">
            <span className="text-[11px] font-mono uppercase tracking-wider">Stock Bajo (≤ 2)</span>
            <AlertCircle size={16} className={lowStockProducts > 0 ? "text-amber-600" : ""} />
          </div>
          <p className={`text-2xl font-bold font-mono ${lowStockProducts > 0 ? "text-amber-600" : "text-brand-black"}`}>
            {lowStockProducts}
          </p>
        </div>
      </div>

      {/* Acceso Directo de Carga Rápida desde Celular */}
      <div className="border border-brand-black bg-brand-surface p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-sm uppercase font-mono font-bold tracking-wider text-brand-black">
            ¿Tomaste una foto nueva desde tu teléfono?
          </h2>
          <p className="text-xs text-brand-muted font-mono">
            Súbela directamente a Cloudinary y publícala en segundos.
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="w-full sm:w-auto text-center px-4 py-2 bg-brand-black text-brand-white text-xs font-mono uppercase tracking-widest hover:bg-neutral-800"
        >
          Subir Foto & Crear
        </Link>
      </div>

      {/* Productos Recientes & Edición Rápida */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase font-mono tracking-widest text-brand-black font-semibold">
            Productos Recientes (Ajuste Rápido)
          </h3>
          <Link
            href="/admin/productos"
            className="text-xs font-mono text-brand-muted hover:text-brand-black uppercase tracking-wider underline"
          >
            Ver todos ({totalProducts}) →
          </Link>
        </div>

        {recentProducts.length === 0 ? (
          <div className="border border-dashed border-brand-border p-8 text-center space-y-3">
            <p className="text-xs font-mono text-brand-muted">No hay productos registrados en la base de datos.</p>
            <Link
              href="/admin/productos/nuevo"
              className="inline-block text-xs font-mono uppercase tracking-wider text-brand-black underline"
            >
              Crear el primer producto
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentProducts.map((product) => (
              <QuickProductRow key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
