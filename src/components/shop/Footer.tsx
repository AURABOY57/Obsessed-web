import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-brand-border bg-brand-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-brand-border">
          {/* Columna 1: Branding */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-widest font-mono text-brand-black">
              obsessed.cba
            </h3>
            <p className="text-xs text-brand-muted max-w-xs font-mono leading-relaxed">
              Mates, bombillas, termos y accesorios materos. Gran calidad y diseños puros desde Córdoba, Argentina.
            </p>
            <p className="text-[11px] font-mono text-brand-muted">
              Córdoba, Argentina.
            </p>
          </div>

          {/* Columna 2: Contacto & Envíos */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest font-mono text-brand-black">
              Atención Personalizada
            </h4>
            <p className="text-xs text-brand-muted font-mono leading-relaxed">
              Coordinamos pagos mediante transferencia o efectivo, y despachos a todo el país con atención directa.
            </p>
          </div>

          {/* Columna 3: Enlaces Rápidos */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest font-mono text-brand-black">
              Navegación
            </h4>
            <ul className="space-y-1.5 text-xs font-mono uppercase tracking-wider text-brand-muted">
              <li>
                <Link href="/" className="hover:text-brand-black transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/productos" className="hover:text-brand-black transition-colors">
                  Productos
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra Inferior */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-brand-muted">
          <p>© {new Date().getFullYear()} obsessed.cba — Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
