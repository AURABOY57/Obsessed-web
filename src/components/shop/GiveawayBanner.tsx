import React from "react";
import Image from "next/image";
import { Gift, Radio, ExternalLink, Trophy, ArrowRight, MessageCircle } from "lucide-react";

interface GiveawayBannerProps {
  whatsappPhone?: string;
}

export function GiveawayBanner({ whatsappPhone = "5493548550965" }: GiveawayBannerProps) {
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    "Hola obsessed.cba! Vi el sorteo del Imperial de Algarrobo con @nnanoide y quisiera consultar por este modelo."
  )}`;

  return (
    <section aria-label="Sorteo Imperial de Algarrobo con @nnanoide" className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="relative overflow-hidden border border-brand-border bg-brand-surface p-6 sm:p-8 lg:p-10 transition-all">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Columna Izquierda: Flyer Visual */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full aspect-[16/9] sm:aspect-[16/10] lg:aspect-[4/3] overflow-hidden border border-brand-border bg-brand-white group shadow-sm">
              <Image
                src="/images/sorteo-nnanoide.png"
                alt="Sorteo Mate Imperial de Algarrobo - obsessed.cba x @nnanoide"
                fill
                unoptimized
                priority
                className="object-contain sm:object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Badge En Vivo / Sábado */}
              <div className="absolute top-3 left-3 bg-brand-black text-brand-white text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>SÁBADO EN STREAM</span>
              </div>

              {/* Badge Colaboración */}
              <div className="absolute bottom-3 right-3 bg-brand-white/90 backdrop-blur-xs text-brand-black text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 border border-brand-border font-bold shadow-xs">
                obsessed x @nnanoide
              </div>
            </div>
          </div>

          {/* Columna Derecha: Información y Acciones con la paleta de Inicio */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tag Pre-cabecera */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-black text-brand-white text-[10px] font-mono uppercase tracking-widest">
              <Trophy size={13} className="text-amber-300" />
              <span>Colaboración Exclusiva • Edición Especial</span>
            </div>

            {/* Título Principal */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-widest font-mono text-brand-black leading-tight">
                ¿Querés Ganar un Imperial de Algarrobo?
              </h2>
              <p className="text-xs sm:text-sm font-mono text-brand-muted leading-relaxed max-w-xl">
                Nos unimos con el streamer <strong className="text-brand-black">@nnanoide y @germanusinger</strong> para regalar un auténtico <strong className="text-brand-black">Mate Imperial de Algarrobo</strong> con virola de alpaca cincelada a mano.
              </p>
            </div>

            {/* Puntos Clave / Tarjetas Blancas con Bordes Suaves */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-4 bg-brand-white border border-brand-border space-y-1 shadow-xs">
                <div className="flex items-center gap-2 text-brand-black text-xs font-mono font-bold uppercase tracking-wider">
                  <Gift size={15} />
                  <span>El Premio</span>
                </div>
                <p className="text-[11px] font-mono text-brand-muted leading-relaxed">
                  Mate Imperial torneado en madera noble de algarrobo con virola de alpaca cincelada artesanal.
                </p>
              </div>

              <div className="p-4 bg-brand-white border border-brand-border space-y-1 shadow-xs">
                <div className="flex items-center gap-2 text-brand-black text-xs font-mono font-bold uppercase tracking-wider">
                  <Radio size={15} className="text-red-500" />
                  <span>En Directo</span>
                </div>
                <p className="text-[11px] font-mono text-brand-muted leading-relaxed">
                  El ganador se anunciará este <strong className="text-brand-black">Sábado en vivo durante el stream</strong> de @nnanoide para reclamar su premio.
                </p>
              </div>
            </div>

            {/* Cuentas Oficiales */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs font-mono text-brand-black">
              <span className="text-[10px] text-brand-muted uppercase tracking-wider">Seguir:</span>
              <a
                href="https://www.instagram.com/nnanoide/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-brand-white hover:bg-brand-surface border border-brand-border text-brand-black text-[11px] transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>@nnanoide</span>
                <ExternalLink size={10} className="text-brand-muted" />
              </a>
              <a
                href="https://www.instagram.com/germanusinger/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-brand-white hover:bg-brand-surface border border-brand-border text-brand-black text-[11px] transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>@germanusinger</span>
                <ExternalLink size={10} className="text-brand-muted" />
              </a>
              <a
                href="https://www.instagram.com/obsessed.cba/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-brand-black hover:bg-neutral-800 border border-brand-black text-brand-white text-[11px] transition-colors flex items-center gap-1.5 font-bold shadow-xs"
              >
                <span>@obsessed.cba</span>
                <ExternalLink size={10} className="text-neutral-400" />
              </a>
            </div>

            {/* Botones de Acción con Estilo Monocromático de la Marca */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href="https://www.instagram.com/nnanoide/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-brand-black text-brand-white text-xs font-mono uppercase tracking-widest hover:bg-neutral-900 border border-brand-black transition-all flex items-center justify-center gap-2 shadow-sm group cursor-pointer"
              >
                <span>Ver Stream & Perfil de @nnanoide</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-brand-white text-brand-black hover:bg-brand-black hover:text-brand-white border border-brand-black text-xs font-mono uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <MessageCircle size={14} />
                <span>Consultar por este modelo</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
