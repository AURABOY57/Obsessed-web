import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Gift, Radio, ExternalLink, Sparkles, Trophy, ArrowRight, MessageCircle } from "lucide-react";

interface GiveawayBannerProps {
  whatsappPhone?: string;
}

export function GiveawayBanner({ whatsappPhone = "5493548550965" }: GiveawayBannerProps) {
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    "Hola obsessed.cba! Vi el sorteo del Imperial de Algarrobo con @nnanoide y quisiera consultar por este modelo."
  )}`;

  return (
    <section aria-label="Sorteo Imperial de Algarrobo con @nnanoide" className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="relative overflow-hidden border border-neutral-800 bg-gradient-to-b from-neutral-950 via-brand-black to-neutral-950 text-brand-white shadow-2xl p-6 sm:p-8 lg:p-10">
        {/* Glow de fondo sutil */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Columna Izquierda: Flyer Visual con Badges */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full aspect-[16/9] sm:aspect-[16/10] lg:aspect-[4/3] rounded-sm overflow-hidden border border-neutral-700/80 bg-neutral-900 group shadow-xl">
              <Image
                src="/images/sorteo-nnanoide.png"
                alt="Sorteo Mate Imperial de Algarrobo - obsessed.cba x @nnanoide"
                fill
                unoptimized
                priority
                className="object-contain sm:object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Badge En Vivo / Sábado */}
              <div className="absolute top-3 left-3 bg-red-600/90 backdrop-blur-xs text-white text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>SÁBADO EN STREAM</span>
              </div>

              {/* Badge Colaboración */}
              <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-xs text-brand-white text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 border border-white/20">
                obsessed x @nnanoide
              </div>
            </div>

            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mt-2.5 flex items-center gap-1.5">
              <Sparkles size={11} className="text-amber-400" />
              <span>Flyer oficial del sorteo • Pieza única de Algarrobo</span>
            </span>
          </div>

          {/* Columna Derecha: Información, Detalles y Botones de Acción */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tag Pre-cabecera */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-700 text-amber-300 text-[10px] font-mono uppercase tracking-widest">
              <Trophy size={13} className="text-amber-400" />
              <span>Colaboración Exclusiva • Edición Limitada</span>
            </div>

            {/* Título Principal */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-wider font-mono text-white leading-tight">
                ¿Querés Ganar un Imperial de Algarrobo?
              </h2>
              <p className="text-xs sm:text-sm font-mono text-neutral-300 leading-relaxed max-w-xl">
                Nos unimos con el streamer <strong className="text-white">@nnanoide</strong> (German Usinger) para regalar un auténtico <strong className="text-amber-300">Mate Imperial de Algarrobo</strong> con virola cincelada a mano.
              </p>
            </div>

            {/* Puntos Clave / Destacados */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-neutral-900/80 border border-neutral-800 space-y-1">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase">
                  <Gift size={15} />
                  <span>El Premio</span>
                </div>
                <p className="text-[11px] font-mono text-neutral-400 leading-relaxed">
                  Mate Imperial torneado en madera noble de algarrobo con virola de alpaca cincelada artesanal.
                </p>
              </div>

              <div className="p-3.5 bg-neutral-900/80 border border-neutral-800 space-y-1">
                <div className="flex items-center gap-2 text-red-400 text-xs font-mono font-bold uppercase">
                  <Radio size={15} />
                  <span>En Directo</span>
                </div>
                <p className="text-[11px] font-mono text-neutral-400 leading-relaxed">
                  El ganador se anunciará este <strong className="text-neutral-200">Sábado en vivo durante el stream</strong> de @nnanoide para reclamar su premio.
                </p>
              </div>
            </div>

            {/* Cuentas oficiales */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono text-neutral-300">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Cuentas:</span>
              <a
                href="https://www.instagram.com/nnanoide/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white rounded-xs text-[11px] transition-colors flex items-center gap-1.5"
              >
                <span>@nnanoide</span>
                <ExternalLink size={10} className="text-neutral-400" />
              </a>
              <a
                href="https://www.instagram.com/germanusinger/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white rounded-xs text-[11px] transition-colors flex items-center gap-1.5"
              >
                <span>@germanusinger</span>
                <ExternalLink size={10} className="text-neutral-400" />
              </a>
              <a
                href="https://www.instagram.com/obsessed.cba/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-amber-300 rounded-xs text-[11px] transition-colors flex items-center gap-1.5 font-bold"
              >
                <span>@obsessed.cba</span>
                <ExternalLink size={10} className="text-amber-400" />
              </a>
            </div>

            {/* Botones de Acción */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href="https://www.instagram.com/nnanoide/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-brand-white text-brand-black text-xs font-mono uppercase tracking-widest font-bold hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-md group"
              >
                <span>Ver Stream & Perfil de @nnanoide</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 text-xs font-mono uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={14} className="text-emerald-400" />
                <span>Consultar por este modelo</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
