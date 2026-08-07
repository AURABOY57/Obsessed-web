"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Lock } from "lucide-react";

export function Navbar() {
  const { totalItems, setIsOpen } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-brand-white/95 backdrop-blur-sm border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 grid grid-cols-3 items-center">
        {/* Logo a la Izquierda */}
        <div className="flex items-center justify-start">
          <Link
            href="/"
            className="text-base sm:text-xl font-bold uppercase tracking-widest font-mono text-brand-black hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            obsessed.cba
          </Link>
        </div>

        {/* Navegación al Centro */}
        <nav className="flex items-center justify-center gap-4 sm:gap-8">
          <Link
            href="/"
            className="text-xs uppercase font-mono tracking-widest text-brand-black hover:text-brand-muted transition-colors"
          >
            Inicio
          </Link>
          <Link
            href="/productos"
            className="text-xs uppercase font-mono tracking-widest text-brand-black hover:text-brand-muted transition-colors"
          >
            Productos
          </Link>
        </nav>

        {/* Acciones Derecha (Admin & Carrito) */}
        <div className="flex items-center justify-end gap-3 sm:gap-4">
          <Link
            href="/admin"
            title="Panel de Administración"
            className="text-brand-muted hover:text-brand-black p-1.5 transition-colors hidden xs:flex items-center gap-1 text-[11px] font-mono uppercase"
          >
            <Lock size={14} />
            <span className="hidden md:inline">Admin</span>
          </Link>

          {/* Botón Carrito */}
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Abrir carrito"
            className="relative p-2 text-brand-black hover:opacity-75 transition-opacity border border-brand-black flex items-center gap-2 px-2.5 sm:px-3 py-1.5 cursor-pointer"
          >
            <ShoppingBag size={16} />
            <span className="text-xs font-mono font-bold tracking-wider">
              {mounted ? totalItems : 0}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
