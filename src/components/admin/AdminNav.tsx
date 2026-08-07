"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdminAction } from "@/actions/auth-actions";
import { LayoutDashboard, Package, PlusCircle, ExternalLink, LogOut } from "lucide-react";

export function AdminNav() {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/productos", label: "Productos", icon: Package },
    { href: "/admin/productos/nuevo", label: "+ Nuevo", icon: PlusCircle },
  ];

  return (
    <>
      {/* Header Superior Fijo */}
      <header className="sticky top-0 z-40 w-full border-b border-brand-border bg-brand-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-sm font-semibold tracking-widest uppercase font-mono text-brand-black"
            >
              obsessed.cba <span className="text-[10px] text-brand-muted font-normal">/ ADMIN</span>
            </Link>
          </div>

          {/* Enlaces de Navegación en Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 text-xs uppercase font-mono tracking-widest transition-colors py-1 border-b ${
                    isActive
                      ? "border-brand-black text-brand-black font-semibold"
                      : "border-transparent text-brand-muted hover:text-brand-black"
                  }`}
                >
                  <Icon size={14} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Acciones Rápidas */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1 text-[11px] font-mono text-brand-muted hover:text-brand-black uppercase tracking-wider px-2.5 py-1 border border-brand-border hover:border-brand-black transition-colors"
            >
              <ExternalLink size={12} />
              <span className="hidden sm:inline">Ver Tienda</span>
            </Link>

            <form action={logoutAdminAction}>
              <button
                type="submit"
                title="Cerrar sesión"
                className="flex items-center gap-1 text-[11px] font-mono text-brand-muted hover:text-red-600 uppercase tracking-wider p-1.5 border border-transparent hover:border-red-200 transition-colors"
              >
                <LogOut size={15} />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Barra de Navegación Inferior Fija para Móviles */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-brand-white border-t border-brand-border flex items-center justify-around h-14">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 text-[9px] font-mono uppercase tracking-wider ${
                isActive ? "text-brand-black font-bold" : "text-brand-muted"
              }`}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
