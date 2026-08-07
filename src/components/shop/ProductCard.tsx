import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { DirectWhatsAppButton } from "@/components/shop/DirectWhatsAppButton";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    imageUrl: string;
    category?: string | null;
    subCategory?: string | null;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group border border-brand-border bg-brand-white flex flex-col justify-between transition-all duration-300 hover:border-brand-black">
      {/* Contenedor de la Imagen */}
      <Link
        href={`/productos/${product.slug}`}
        className="relative w-full aspect-[4/5] bg-brand-surface overflow-hidden flex items-center justify-center cursor-pointer block"
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Badge de Stock Agotado */}
        {isOutOfStock && (
          <div className="absolute top-2 left-2 bg-brand-black text-brand-white text-[9px] font-mono uppercase tracking-widest px-2 py-0.5">
            Agotado
          </div>
        )}

        {/* Categoría y Subcategoría Sutil */}
        {(product.category || product.subCategory) && (
          <div className="absolute bottom-2 left-2 bg-brand-white/90 backdrop-blur-xs text-brand-black text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 border border-brand-border flex items-center gap-1">
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
          <p className="text-sm font-bold font-mono text-brand-black">
            {formatPrice(product.price)}
          </p>
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
