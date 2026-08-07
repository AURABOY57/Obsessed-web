"use client";

import React from "react";
import { usePathname } from "next/navigation";

export function FloatingWhatsAppButton() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "5493548550965";
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    "Hola obsessed.cba! Quisiera hacerles una consulta."
  )}`;

  return (
    <aside
      aria-label="Contacto de WhatsApp"
      className={`fixed bottom-6 right-6 z-50 items-center justify-center ${
        isHome ? "flex" : "hidden md:flex"
      }`}
    >
      {/* Anillo de pulso/parpadeo sutil */}
      <span className="absolute inline-flex h-12 w-12 sm:h-14 sm:w-14 animate-ping rounded-full bg-emerald-500/30 opacity-75 pointer-events-none" />

      {/* Botón Flotante en Negro Monocromático de Autor */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        title="Consultas directas por WhatsApp"
        className="relative group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-brand-black text-brand-white hover:bg-neutral-900 rounded-full shadow-2xl border border-brand-black/20 hover:scale-110 active:scale-95 transition-all duration-300 ease-out"
      >
        {/* Indicador de estado activo verde parpadeante */}
        <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-brand-white" />
        </span>

        {/* Ícono de WhatsApp centrado ópticamente */}
        <div className="flex items-center justify-center w-full h-full pl-[1px] pt-[0.5px]">
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7 fill-brand-white transition-transform duration-300 group-hover:scale-105"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 0 0 1.333 4.993L2 22l5.233-1.237a9.994 9.994 0 0 0 4.779 1.217h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.037-5.176-2.925-7.064A9.925 9.925 0 0 0 12.012 2zm5.821 14.131c-.241.677-1.385 1.288-1.921 1.368-.49.073-1.129.103-3.277-.791-2.483-1.032-4.084-3.568-4.208-3.733-.124-.165-1.006-1.339-1.006-2.553 0-1.214.636-1.811.863-2.057.227-.247.496-.309.661-.309.165 0 .331.002.475.009.153.007.357-.058.558.425.207.496.702 1.713.764 1.837.062.124.103.268.021.433-.083.165-.124.268-.247.413-.124.144-.261.323-.373.433-.124.124-.254.258-.109.506.144.247.643 1.058 1.378 1.713.947.844 1.745 1.106 1.993 1.23.247.124.392.103.537-.062.144-.165.62-.722.785-.97.165-.247.331-.207.558-.124.227.083 1.446.681 1.694.805.247.124.413.186.475.289.062.103.062.599-.179 1.276z" />
          </svg>
        </div>
      </a>
    </aside>
  );
}
