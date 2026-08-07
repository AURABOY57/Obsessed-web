import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { ArrowLeft } from "lucide-react";

export default function NewProductPage() {
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
          Cargar Nuevo Producto
        </h1>
        <p className="text-xs font-mono text-brand-muted mt-1">
          Sube la fotografía, define precio y cantidad disponible.
        </p>
      </div>

      <ProductForm />
    </div>
  );
}
