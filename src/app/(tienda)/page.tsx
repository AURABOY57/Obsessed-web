import React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/shop/ProductCard";
import { GiveawayBanner } from "@/components/shop/GiveawayBanner";
import { ArrowDown, MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

interface HomeProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  offerPrice?: number | null;
  offerEndsAt?: string | null;
  offerLabel?: string | null;
  stock: number;
  imageUrl: string;
  images?: string[];
  category: string;
  subCategory?: string | null;
}

// Datos de demostración de alta calidad en caso de base de datos vacía (4 productos destacados)
const DEMO_PRODUCTS: HomeProduct[] = [
  {
    id: "demo-1",
    name: "Mate Imperial Premium Noir",
    slug: "mate-imperial-premium-noir",
    price: 48000,
    stock: 8,
    imageUrl: "/images/products/mate-imperial-noir.png",
    category: "Mates",
    subCategory: "Imperial",
  },
  {
    id: "demo-2",
    name: "Mate Torpedo Cuero Seleccionado",
    slug: "mate-torpedo-cuero-seleccionado",
    price: 42000,
    stock: 6,
    imageUrl: "/images/products/mate-torpedo-cuero.png",
    category: "Mates",
    subCategory: "Torpedo",
  },
  {
    id: "demo-3",
    name: "Termo Obsidian Matte 1L",
    slug: "termo-obsidian-matte-1l",
    price: 68000,
    stock: 10,
    imageUrl: "/images/products/termo-obsidian-black.png",
    category: "Termos",
    subCategory: "Acero Inox",
  },
  {
    id: "demo-4",
    name: "Bombilla Pico de Loro Alpaca Cincelada",
    slug: "bombilla-pico-de-loro-alpaca-cincelada",
    price: 18500,
    stock: 15,
    imageUrl: "/images/products/bombilla-alpaca-pico.png",
    category: "Bombillas",
    subCategory: "Alpaca Maciza",
  },
];

export default async function StoreHomePage() {
  let products: HomeProduct[] = DEMO_PRODUCTS;

  try {
    // 1. Obtener productos activos marcados como destacados (isFeatured = true)
    const featuredProducts = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { updatedAt: "desc" },
      take: 4,
    });

    let selectedDbProducts = [...featuredProducts];

    // 2. Si hay menos de 4 destacados elegidos en admin, completar con los más recientes activos
    if (selectedDbProducts.length < 4) {
      const needed = 4 - selectedDbProducts.length;
      const excludeIds = selectedDbProducts.map((p) => p.id);

      const extraProducts = await prisma.product.findMany({
        where: {
          isActive: true,
          id: { notIn: excludeIds },
        },
        orderBy: { createdAt: "desc" },
        take: needed,
      });

      selectedDbProducts = [...selectedDbProducts, ...extraProducts];
    }

    if (selectedDbProducts.length > 0) {
      products = selectedDbProducts.slice(0, 4).map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
        offerPrice: p.offerPrice ? Number(p.offerPrice) : null,
        offerEndsAt: p.offerEndsAt ? p.offerEndsAt.toISOString() : null,
        offerLabel: p.offerLabel,
        stock: p.stock,
        imageUrl: p.imageUrl,
        images: p.images,
        category: p.category || "Mates",
        subCategory: p.subCategory || null,
      }));
    }
  } catch (error) {
    console.warn("[STORE_HOME]: Usando productos demo mientras se conecta la BD.", error);
  }

  const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "5493548550965";
  const whatsappConsultUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    "Hola obsessed.cba! Quisiera consultar por mates y accesorios."
  )}`;

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section Editorial con Fondo de Sierras y Filtro Blur */}
      <section className="relative overflow-hidden border-b border-brand-border py-24 sm:py-32 px-4 sm:px-6 flex flex-col items-center justify-center text-center">
        {/* Imagen de Fondo de las Sierras con Efecto Blur */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Image
            src="/images/sierras_hd.png"
            alt="Sierras de Córdoba - obsessed.cba"
            fill
            priority
            quality={100}
            className="object-cover object-center scale-105 filter blur-[2px] brightness-[0.98] contrast-[1.05]"
          />
          {/* Overlay Blanco Traslúcido para Contraste y Tipografía Impecable */}
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px]" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-6">

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-widest font-mono text-brand-black leading-none tracking-tighter sm:tracking-widest">
            obsessed.cba
          </h1>

          <p className="text-xs sm:text-sm font-mono text-brand-black max-w-xl mx-auto uppercase tracking-wider leading-relaxed font-semibold">
            Mates de Autor • Bombillas de Alpaca • Termos & Accesorios. El ritual argentino elevado al diseño y la precisión.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/productos"
              className="w-full sm:w-auto px-8 py-3.5 bg-brand-black text-brand-white text-xs font-mono uppercase tracking-widest hover:bg-neutral-900 border border-brand-black transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Ver Catálogo completo</span>
              <ArrowDown size={14} />
            </Link>
            <a
              href={whatsappConsultUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 bg-brand-white/90 text-brand-black text-xs font-mono uppercase tracking-widest hover:bg-brand-white border border-brand-black transition-all flex items-center justify-center gap-2 backdrop-blur-sm shadow-sm"
            >
              <MessageCircle size={14} />
              <span>Contacto WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* Grid de Productos / Vidriera Principal */}
      <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 scroll-mt-20">
        <div className="border-b border-brand-border pb-4">
          <h2 className="text-xs uppercase font-mono tracking-widest font-bold text-brand-black">
            Piezas Destacadas
          </h2>
          <p className="text-[11px] font-mono text-brand-muted mt-0.5">
            Mates seleccionados, alpacas cinceladas y termos térmicos
          </p>
        </div>

        {/* Grid Responsivo (1 col en móvil, 2 en tablet, 3-4 en desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center pt-4">
          <Link
            href="/productos"
            className="inline-flex items-center justify-center px-8 py-3.5 border border-brand-black bg-brand-white text-brand-black text-xs font-mono uppercase tracking-widest hover:bg-brand-black hover:text-brand-white transition-all"
          >
            Explorar Todos los Productos y Filtrar
          </Link>
        </div>
      </section>

      {/* Apartado Especial: Sorteo Imperial de Algarrobo con @nnanoide */}
      <GiveawayBanner whatsappPhone={phone} />

      {/* Filosofía del Mate y la Marca */}
      <section id="about" className="border-y border-brand-border bg-brand-surface py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-muted">
            El Ritual obsessed.cba • Córdoba
          </span>
          <h3 className="text-xl sm:text-2xl font-bold uppercase font-mono tracking-widest text-brand-black">
            Elevá tu ritual: Calidad suprema en calabaza con tu diseño único
          </h3>
          <p className="text-xs sm:text-sm font-mono text-brand-muted leading-relaxed">
            Llevá tu experiencia matera al siguiente nivel con un producto único y de primera. Te ofrecemos grabados 100% personalizados para que tu mate sea verdaderamente tuyo, adaptando el diseño o nombre que elijas. Nos destacamos por brindar solo calidad 100% calabaza seleccionada, garantizando así la máxima durabilidad y el mejor sabor. Además, nuestra prioridad es la consistencia, por eso llevamos más de un año trabajando con el mismo proveedor de confianza para asegurarte siempre la misma excelencia en cada producto. Escribinos para armar el tuyo hoy mismo.
          </p>
        </div>
      </section>
    </div>
  );
}
