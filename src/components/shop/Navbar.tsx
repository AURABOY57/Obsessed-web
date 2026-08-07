"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Lock } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { totalItems, setIsOpen } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-brand-white/95 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo a la Izquierda */}
        <div className="flex items-center shrink-0">
          <Link
            href="/"
            className="text-xs sm:text-base md:text-lg font-bold uppercase tracking-wider sm:tracking-widest font-mono text-brand-black hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            obsessed.cba
          </Link>
        </div>

        {/* Navegación al Centro (Adaptable y fluida) */}
        <nav className="flex items-center justify-center gap-3 sm:gap-8 px-1">
          <Link
            href="/"
            className={`text-[11px] sm:text-xs uppercase font-mono tracking-wider sm:tracking-widest transition-colors py-1 ${
              pathname === "/"
                ? "text-brand-black font-bold border-b border-brand-black"
                : "text-brand-muted hover:text-brand-black"
            }`}
          >
            Inicio
          </Link>
          <Link
            href="/productos"
            className={`text-[11px] sm:text-xs uppercase font-mono tracking-wider sm:tracking-widest transition-colors py-1 ${
              pathname.startsWith("/productos")
                ? "text-brand-black font-bold border-b border-brand-black"
                : "text-brand-muted hover:text-brand-black"
            }`}
          >
            Productos
          </Link>
        </nav>

        {/* Acciones Derecha (Admin & Carrito) */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-3 shrink-0">
          <Link
            href="/admin"
            title="Panel de Administración"
            aria-label="Panel de Administración"
            className="text-brand-muted hover:text-brand-black p-1.5 sm:p-2 transition-colors flex items-center justify-center hover:bg-neutral-100/80"
          >
            <Lock className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </Link>

          {/* Botón Carrito */}
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Abrir carrito de compras"
            className="relative text-brand-black hover:bg-neutral-100 transition-all border border-brand-black flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 cursor-pointer"
          >
            <ShoppingBag size={14} className="sm:w-4 sm:h-4" />
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider">
              {mounted ? totalItems : 0}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
