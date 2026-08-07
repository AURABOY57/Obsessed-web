import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { ProductPurchaseSection } from "@/components/shop/ProductPurchaseSection";
import { OfferCountdown } from "@/components/shop/OfferCountdown";
import { ArrowLeft, ShieldCheck, Truck, MessageCircle, Flame } from "lucide-react";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  let product: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    category: string | null;
    price: number;
    originalPrice?: number | null;
    offerPrice?: number | null;
    offerEndsAt?: string | Date | null;
    offerLabel?: string | null;
    stock: number;
    imageUrl: string;
    images: string[];
    variants?: any;
    isActive: boolean;
  } | null = null;

  try {
    const dbProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (dbProduct) {
      product = {
        id: dbProduct.id,
        name: dbProduct.name,
        slug: dbProduct.slug,
        description: dbProduct.description,
        category: dbProduct.category,
        price: Number(dbProduct.price),
        originalPrice: dbProduct.originalPrice ? Number(dbProduct.originalPrice) : null,
        offerPrice: dbProduct.offerPrice ? Number(dbProduct.offerPrice) : null,
        offerEndsAt: dbProduct.offerEndsAt ? dbProduct.offerEndsAt.toISOString() : null,
        offerLabel: dbProduct.offerLabel,
        stock: dbProduct.stock,
        imageUrl: dbProduct.imageUrl,
        images: dbProduct.images,
        variants: dbProduct.variants,
        isActive: dbProduct.isActive,
      };
    }
  } catch (error) {
    console.error("[PRODUCT_DETAIL_ERROR]:", error);
  }

  // Fallback para demo si no existe en BD
  if (!product) {
    const MATE_DEMOS: Record<string, any> = {
      "mate-imperial-premium-noir": {
        id: "demo-1",
        name: "Mate Imperial Premium Noir",
        slug: "mate-imperial-premium-noir",
        description: "Calabaza natural gruesa seleccionada a mano, forrada en cuero vacuno legítimo de curtido vegetal negro con costura artesanal. Virola de alpaca maciza cincelada a mano por orfebres. Base reforzada de 4 patas para máxima estabilidad.",
        category: "Mates",
        price: 48000,
        stock: 8,
        variants: [{ name: "Virola", options: ["Lisa", "Cincelada"] }],
        imageUrl: "/images/products/mate-imperial-noir.png",
        images: [],
        isActive: true,
      },
      "mate-torpedo-cuero-seleccionado": {
        id: "demo-2",
        name: "Mate Torpedo Cuero Seleccionado",
        slug: "mate-torpedo-cuero-seleccionado",
        description: "Clásico mate torpedo uruguayo. Calabaza brasileña de paredes gruesas forrada en cuero negro de alta densidad con virola lisa pulida a espejo de alpaca. Compacto, ergonómico y térmico.",
        category: "Mates",
        price: 42000,
        stock: 6,
        variants: [{ name: "Color", options: ["Negro", "Marrón"] }],
        imageUrl: "/images/products/mate-torpedo-cuero.png",
        images: [],
        isActive: true,
      },
      "termo-obsidian-matte-1l": {
        id: "demo-3",
        name: "Termo Obsidian Matte 1L",
        slug: "termo-obsidian-matte-1l",
        description: "Termo de acero inoxidable 18/8 con tecnología de aislamiento al vacío de doble pared. Conserva el agua caliente por más de 24 horas. Acabado en pintura electrostática negro mate antideslizante con pico cebador de flujo continuo.",
        category: "Termos",
        price: 68000,
        stock: 10,
        imageUrl: "/images/products/termo-obsidian-black.png",
        images: [],
        isActive: true,
      },
      "bombilla-pico-de-loro-alpaca-cincelada": {
        id: "demo-4",
        name: "Bombilla Pico de Loro Alpaca Cincelada",
        slug: "bombilla-pico-de-loro-alpaca-cincelada",
        description: "Bombilla modelo pico de loro fabricada en alpaca maciza cincelada artesanalmente. Caño de 19 cm con curvatura ergonómica, filtro ranurado micro-perforado que previene obstrucciones y anillo disipador de calor.",
        category: "Bombillas",
        price: 18500,
        stock: 15,
        variants: [{ name: "Modelo", options: ["Pico de Loro", "Resorte"] }],
        imageUrl: "/images/products/bombilla-alpaca-pico.png",
        images: [],
        isActive: true,
      },
    };

    if (MATE_DEMOS[slug]) {
      product = MATE_DEMOS[slug];
    }
  }

  if (!product) {
    notFound();
  }

  const isOutOfStock = product.stock <= 0;
  const isOfferActive = Boolean(
    product.offerEndsAt &&
      new Date(product.offerEndsAt).getTime() > Date.now() &&
      product.originalPrice &&
      Number(product.originalPrice) > Number(product.price)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      {/* Botón Volver */}
      <Link
        href="/productos"
        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-muted hover:text-brand-black transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Volver a la Colección</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Columna Izquierda: Fotografía */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative w-full aspect-[4/5] border border-brand-border bg-brand-surface overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              unoptimized
              priority
              className="object-cover"
            />
            {isOfferActive && (
              <div className="absolute top-4 right-4 bg-amber-500 text-black text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 flex items-center gap-1.5 shadow-md">
                <Flame size={14} />
                <span>{product.offerLabel || "OFERTA"}</span>
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Información & Compra */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="space-y-3 border-b border-brand-border pb-6">
            {product.category && (
              <span className="text-[10px] uppercase tracking-widest font-mono text-brand-muted">
                {product.category}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold font-mono uppercase tracking-wide text-brand-black">
              {product.name}
            </h1>

            {/* Bloque de Precios y Oferta */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-2xl font-bold font-mono text-brand-black">
                  {formatPrice(product.price)}
                </span>
                {isOfferActive && product.originalPrice && (
                  <span className="text-base font-mono text-neutral-400 line-through">
                    {formatPrice(Number(product.originalPrice))}
                  </span>
                )}
              </div>

              {/* Cuenta Regresiva de Oferta */}
              {isOfferActive && (
                <OfferCountdown
                  endsAt={product.offerEndsAt}
                  label={product.offerLabel}
                />
              )}
            </div>

            <div className="pt-1">
              <span
                className={`text-[11px] font-mono uppercase tracking-wider ${
                  isOutOfStock ? "text-red-600" : "text-brand-muted"
                }`}
              >
                {isOutOfStock ? "Sin stock disponible" : `Stock disponible: ${product.stock} unidades`}
              </span>
            </div>
          </div>

          {/* Descripción */}
          {product.description && (
            <div className="space-y-2">
              <h3 className="text-xs uppercase font-mono tracking-widest text-brand-black font-semibold">
                Detalles de la Pieza
              </h3>
              <p className="text-xs font-mono text-brand-muted leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Selector de Variantes y Botones de Compra */}
          <div className="pt-4 border-t border-brand-border">
            <ProductPurchaseSection product={product} />
          </div>

          {/* Beneficios & Envíos */}
          <div className="space-y-3 pt-6 border-t border-brand-border">
            <div className="flex items-center gap-3 text-xs font-mono text-brand-muted">
              <Truck size={16} className="text-brand-black flex-shrink-0" />
              <span>Envíos a Córdoba Capital y todo el país.</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-brand-muted">
              <MessageCircle size={16} className="text-brand-black flex-shrink-0" />
              <span>Atención 100% personalizada con el vendedor.</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-brand-muted">
              <ShieldCheck size={16} className="text-brand-black flex-shrink-0" />
              <span>Calidad garantizada y materiales seleccionados.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
