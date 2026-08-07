import React from "react";
import Link from "next/link";
import { Instagram } from "lucide-react";

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
            <div className="pt-1">
              <a
                href="https://www.instagram.com/obsessed.cba/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono text-brand-black hover:text-brand-muted transition-colors"
              >
                <Instagram className="w-4 h-4" />
                <span>@obsessed.cba</span>
              </a>
            </div>
          </div>

          {/* Columna 2: Contacto & Envíos */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest font-mono text-brand-black">
              Atención Personalizada
            </h4>
            <p className="text-xs text-brand-muted font-mono leading-relaxed">
              Coordinamos pagos mediante transferencia o efectivo, y despachos a todo el país con atención directa.
            </p>
            <p className="text-[11px] font-mono text-brand-muted">
              Córdoba, Argentina.
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
              <li>
                <a
                  href="https://www.instagram.com/obsessed.cba/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-black transition-colors inline-flex items-center gap-1.5"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra Inferior */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-brand-muted">
          <p>© {new Date().getFullYear()} obsessed.cba — Todos los derechos reservados.</p>
          <a
            href="https://www.instagram.com/obsessed.cba/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-brand-black transition-colors"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>@obsessed.cba</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

