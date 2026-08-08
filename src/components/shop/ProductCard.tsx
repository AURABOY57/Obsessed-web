import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { DirectWhatsAppButton } from "@/components/shop/DirectWhatsAppButton";
import { OfferCountdown } from "@/components/shop/OfferCountdown";
import { Flame, Video } from "lucide-react";
import { isVideoUrl } from "@/components/admin/MultiMediaUpload";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number | null;
    offerPrice?: number | null;
    offerEndsAt?: string | Date | null;
    offerLabel?: string | null;
    stock: number;
    imageUrl: string;
    images?: string[];
    category?: string | null;
    subCategory?: string | null;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;

  const isOfferActive = Boolean(
    product.offerEndsAt &&
      new Date(product.offerEndsAt).getTime() > Date.now() &&
      product.originalPrice &&
      Number(product.originalPrice) > Number(product.price)
  );

  // 1ª foto/video es Portada, última foto/video es Hover
  const mediaList =
    product.images && product.images.length > 0
      ? product.images
      : product.imageUrl && product.imageUrl.trim() !== ""
      ? [product.imageUrl]
      : [];

  const coverMedia = mediaList[0] || "";
  const hoverMedia = mediaList.length > 1 ? mediaList[mediaList.length - 1] : null;

  const isCoverVideo = isVideoUrl(coverMedia);
  const isHoverVideo = hoverMedia ? isVideoUrl(hoverMedia) : false;
  const hasAnyVideo = mediaList.some(isVideoUrl);

  return (
    <div className="group border border-brand-border bg-brand-white flex flex-col justify-between transition-all duration-300 hover:border-brand-black">
      {/* Contenedor de la Imagen con Soporte de Hover y Video */}
      <Link
        href={`/productos/${product.slug}`}
        className="relative w-full aspect-[4/5] bg-brand-surface overflow-hidden flex items-center justify-center cursor-pointer block"
      >
        {coverMedia ? (
          <>
            {/* Portada Principal (1ª Foto / Video) */}
            <div
              className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${
                hoverMedia ? "group-hover:opacity-0" : "group-hover:scale-105 transition-transform duration-500"
              }`}
            >
              {isCoverVideo ? (
                <video
                  src={coverMedia}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={coverMedia}
                  alt={product.name}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              )}
            </div>

            {/* Hover Foto / Video (Última del listado) */}
            {hoverMedia && (
              <div className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
                {isHoverVideo ? (
                  <video
                    src={hoverMedia}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={hoverMedia}
                    alt={`${product.name} - Vista Alternativa`}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                )}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 bg-neutral-100 p-4 text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold">
              {product.name}
            </span>
            <span className="text-[9px] font-mono text-neutral-400 mt-1">
              (Sin imagen)
            </span>
          </div>
        )}

        {/* Badge de Stock Agotado */}
        {isOutOfStock && (
          <div className="absolute top-2 left-2 bg-brand-black text-brand-white text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 z-10">
            Agotado
          </div>
        )}

        {/* Badge de Video disponible */}
        {hasAnyVideo && !isOutOfStock && (
          <div className="absolute bottom-2 right-2 bg-brand-black/80 backdrop-blur-xs text-brand-white text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 flex items-center gap-1 z-10">
            <Video size={10} />
            <span>Video</span>
          </div>
        )}

        {/* Badge de Oferta Activa */}
        {isOfferActive && !isOutOfStock && (
          <div className="absolute top-2 right-2 bg-amber-500 text-black text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 flex items-center gap-1 shadow-sm z-10">
            <Flame size={10} />
            <span>{product.offerLabel || "OFERTA"}</span>
          </div>
        )}

        {/* Categoría y Subcategoría Sutil */}
        {(product.category || product.subCategory) && (
          <div className="absolute bottom-2 left-2 bg-brand-white/90 backdrop-blur-xs text-brand-black text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 border border-brand-border flex items-center gap-1 z-10">
            <span>{product.category || "General"}</span>
            {product.subCategory && (
              <>
                <span className="text-brand-muted">•</span>
                <span className="text-brand-muted">{product.subCategory}</span>
              </>
            )}
          </div>
        )}
      </Link>

      {/* Información del Producto */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <Link
            href={`/productos/${product.slug}`}
            className="block text-xs uppercase tracking-wider font-semibold font-mono text-brand-black hover:underline line-clamp-1"
          >
            {product.name}
          </Link>

          {/* Precio y Oferta */}
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold font-mono text-brand-black">
              {formatPrice(product.price)}
            </p>
            {isOfferActive && product.originalPrice && (
              <span className="text-xs font-mono text-neutral-400 line-through">
                {formatPrice(Number(product.originalPrice))}
              </span>
            )}
          </div>

          {/* Cuenta Regresiva de Oferta */}
          {isOfferActive && (
            <div className="pt-0.5">
              <OfferCountdown endsAt={product.offerEndsAt} compact />
            </div>
          )}
        </div>

        {/* Acciones Rápidas (Carrito + WhatsApp) */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-brand-border">
          <AddToCartButton
            product={product}
            variant="outline"
            className="w-full text-[10px] py-2"
          />
          <DirectWhatsAppButton
            product={product}
            label="Pedir"
            className="w-full text-[10px] py-2"
          />
        </div>
      </div>
    </div>
  );
}
