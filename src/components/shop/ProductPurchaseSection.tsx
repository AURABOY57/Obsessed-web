"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { createOrderAction } from "@/actions/order-actions";
import { buildWhatsAppLink, buildStockInquiryWhatsAppLink } from "@/lib/utils";
import { MessageCircle, ShoppingBag, Check, Clock } from "lucide-react";

export interface ProductVariantData {
  name: string; // ej: "Tipo de Virola"
  options: string[]; // ej: ["Lisa", "Cincelada"]
}

interface ProductPurchaseSectionProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    imageUrl: string;
    variants?: any;
  };
}

export function ProductPurchaseSection({ product }: ProductPurchaseSectionProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Inicializar estado de opciones seleccionadas
  const variants: ProductVariantData[] = Array.isArray(product.variants) ? product.variants : [];
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    variants.forEach((v) => {
      if (v.options && v.options.length > 0) {
        initial[v.name] = v.options[0];
      }
    });
    return initial;
  });

  const isOutOfStock = product.stock <= 0;

  const handleOptionSelect = (variantName: string, option: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [variantName]: option,
    }));
  };

  // Cadena descriptiva de la variante seleccionada (ej: "Virola: Cincelada • Color: Negro")
  const selectedVariantString = Object.entries(selectedOptions)
    .map(([key, val]) => `${key}: ${val}`)
    .join(" • ");

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
        variantName: selectedVariantString || undefined,
      },
      1
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleDirectWhatsApp = async () => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "5493548550965";

    // Si no hay stock, abre consulta directa de reposición / encargo
    if (isOutOfStock) {
      const url = buildStockInquiryWhatsAppLink({
        phone,
        productName: product.name,
        variantName: selectedVariantString || undefined,
      });
      window.open(url, "_blank");
      return;
    }

    setIsProcessing(true);
    let orderNumber: string | undefined = undefined;

    try {
      const res = await createOrderAction({
        customerName: "Cliente WhatsApp",
        customerPhone: "Vía WhatsApp",
        status: "PENDING" as any,
        paymentMethod: "WHATSAPP_COORDINATE",
        items: [
          {
            productId: product.id,
            name: product.name,
            variantName: selectedVariantString || undefined,
            quantity: 1,
            unitPrice: product.price,
          },
        ],
      });

      if (res.success && res.data) {
        orderNumber = (res.data as any).orderNumber;
      }
    } catch (e) {
      console.warn("[DIRECT_WA_ORDER_ERROR]:", e);
    } finally {
      setIsProcessing(false);
    }

    const url = buildWhatsAppLink({
      phone,
      products: [
        {
          name: product.name,
          variantName: selectedVariantString || undefined,
          quantity: 1,
          price: product.price,
        },
      ],
      total: product.price,
      orderNumber,
    });

    window.open(url, "_blank");
  };

  return (
    <div className="space-y-5">
      {/* Selector de Variantes Interactivo */}
      {variants.length > 0 && (
        <div className="space-y-4 pt-2">
          {variants.map((v, idx) => (
            <div key={idx} className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-widest text-brand-black font-semibold">
                {v.name}: <span className="text-brand-muted font-normal">{selectedOptions[v.name]}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {v.options.map((opt) => {
                  const isSelected = selectedOptions[v.name] === opt;
                  return (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => handleOptionSelect(v.name, opt)}
                      className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-brand-black text-brand-white border-brand-black font-bold shadow-xs"
                          : "bg-brand-white text-brand-black border-brand-border hover:border-brand-black"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Aviso informativo si no hay stock */}
      {isOutOfStock && (
        <div className="p-3.5 bg-brand-surface border border-brand-border space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-brand-black">
            <Clock size={14} className="text-amber-500" />
            <span>Sin Stock Inmediato</span>
          </div>
          <p className="text-[11px] font-mono text-brand-muted leading-relaxed">
            Podés consultar cuándo vuelve a ingresar este modelo o coordinar un encargo personalizado por WhatsApp con el taller.
          </p>
        </div>
      )}

      {/* Botones de Acción */}
      <div className="space-y-3 pt-1">
        <button
          onClick={handleDirectWhatsApp}
          disabled={isProcessing}
          className="w-full h-12 inline-flex items-center justify-center gap-2 border border-brand-black bg-brand-black text-brand-white px-4 py-2.5 text-xs font-mono uppercase tracking-widest hover:bg-neutral-900 transition-colors cursor-pointer shadow-xs"
        >
          <MessageCircle size={15} />
          <span>
            {isProcessing
              ? "Generando pedido..."
              : isOutOfStock
              ? "Consultar Cuándo Ingresa / Encargar"
              : "Comprar directo por WhatsApp"}
          </span>
        </button>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="w-full h-12 inline-flex items-center justify-center gap-2 border border-brand-border bg-brand-white text-brand-black px-4 py-2.5 text-xs font-mono uppercase tracking-widest hover:border-brand-black hover:bg-brand-surface transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {added ? (
            <>
              <Check size={15} />
              <span>Agregado al Carrito</span>
            </>
          ) : isOutOfStock ? (
            <span>Agotado para Carrito</span>
          ) : (
            <>
              <ShoppingBag size={15} />
              <span>Agregar al Carrito</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
