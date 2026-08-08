"use client";

import React, { useState } from "react";
import Image from "next/image";
import { isVideoUrl } from "@/components/admin/MultiMediaUpload";
import { Video, Flame, Play, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  productName: string;
  imageUrl: string;
  images?: string[];
  isOfferActive?: boolean;
  offerLabel?: string | null;
}

export function ProductGallery({
  productName,
  imageUrl,
  images = [],
  isOfferActive = false,
  offerLabel = "OFERTA",
}: ProductGalleryProps) {
  // Consolidar lista de hasta 5 medios
  const mediaList =
    images && images.length > 0
      ? images.slice(0, 5)
      : imageUrl && imageUrl.trim() !== ""
      ? [imageUrl]
      : [];

  const [activeIndex, setActiveIndex] = useState(0);

  const activeMedia = mediaList[activeIndex] || imageUrl || "";
  const isActiveVideo = isVideoUrl(activeMedia);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % mediaList.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
  };

  return (
    <div className="space-y-4">
      {/* Visor Principal */}
      <div className="relative w-full aspect-[4/5] border border-brand-border bg-brand-surface overflow-hidden group">
        {activeMedia ? (
          isActiveVideo ? (
            <div className="relative w-full h-full flex items-center justify-center bg-neutral-950">
              <video
                key={activeMedia}
                src={activeMedia}
                controls
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <Image
              key={activeMedia}
              src={activeMedia}
              alt={`${productName} - Vista ${activeIndex + 1}`}
              fill
              unoptimized
              priority
              className="object-cover transition-all duration-300"
            />
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 bg-neutral-100 p-6 text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold">
              {productName}
            </span>
            <span className="text-[10px] font-mono text-neutral-400 mt-1">
              (Sin imagen disponible)
            </span>
          </div>
        )}

        {/* Badge de Oferta */}
        {isOfferActive && (
          <div className="absolute top-4 right-4 bg-amber-500 text-black text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 flex items-center gap-1.5 shadow-md z-10">
            <Flame size={14} />
            <span>{offerLabel || "OFERTA"}</span>
          </div>
        )}

        {/* Indicador de posición y formato */}
        {mediaList.length > 1 && (
          <div className="absolute bottom-4 left-4 bg-brand-black/75 backdrop-blur-xs text-brand-white text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 z-10">
            {activeIndex + 1} / {mediaList.length}
            {isActiveVideo && " • VIDEO"}
          </div>
        )}

        {/* Flechas de Navegación Rápida */}
        {mediaList.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-brand-white/80 hover:bg-brand-white text-brand-black flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Siguiente"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-brand-white/80 hover:bg-brand-white text-brand-black flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Miniaturas de la Galería (Hasta 5 fotos/videos) */}
      {mediaList.length > 1 && (
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {mediaList.map((mediaUrl, idx) => {
            const isSelected = idx === activeIndex;
            const isVideo = isVideoUrl(mediaUrl);

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Seleccionar medio ${idx + 1}`}
                className={`relative aspect-[4/5] border overflow-hidden transition-all cursor-pointer ${
                  isSelected
                    ? "border-brand-black ring-2 ring-brand-black/30 scale-[1.02]"
                    : "border-brand-border opacity-70 hover:opacity-100"
                }`}
              >
                {isVideo ? (
                  <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-white relative">
                    <video
                      src={mediaUrl}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play size={16} className="text-white fill-white opacity-90" />
                    </div>
                    <span className="absolute bottom-1 right-1 bg-red-600 text-white text-[7px] font-mono px-1 py-0.5 font-bold uppercase">
                      VIDEO
                    </span>
                  </div>
                ) : (
                  <Image
                    src={mediaUrl}
                    alt={`Miniatura ${idx + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                )}

                {/* Badge Portada / Hover indicator en miniatura */}
                {idx === 0 && (
                  <span className="absolute top-1 left-1 bg-brand-black text-amber-300 text-[6px] font-mono px-1 font-bold">
                    PORTADA
                  </span>
                )}
                {idx === mediaList.length - 1 && mediaList.length > 1 && (
                  <span className="absolute top-1 right-1 bg-blue-700 text-white text-[6px] font-mono px-1 font-bold">
                    HOVER
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
