"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { buildStockInquiryWhatsAppLink } from "@/lib/utils";
import { ShoppingBag, Check, MessageCircle } from "lucide-react";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    imageUrl: string;
    stock: number;
  };
  selectedVariant?: string;
  quantity?: number;
  variant?: "primary" | "outline";
  className?: string;
  allowInquiryOnOutOfStock?: boolean;
}

export function AddToCartButton({
  product,
  selectedVariant,
  quantity = 1,
  variant = "outline",
  className = "",
  allowInquiryOnOutOfStock = true,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "5493548550965";

  const isOutOfStock = product.stock <= 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      if (allowInquiryOnOutOfStock) {
        const url = buildStockInquiryWhatsAppLink({
          phone,
          productName: product.name,
          variantName: selectedVariant,
        });
        window.open(url, "_blank");
      }
      return;
    }

    addItem(
      {
        ...product,
        variantName: selectedVariant,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleAdd}
      type="button"
      title={isOutOfStock ? "Consultar cuándo vuelve a ingresar por WhatsApp" : "Agregar al carrito"}
      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-mono uppercase tracking-widest transition-all cursor-pointer select-none border ${
        isOutOfStock
          ? "bg-brand-surface text-brand-black border-brand-border hover:border-brand-black hover:bg-brand-black hover:text-brand-white"
          : variant === "primary"
          ? "bg-brand-black text-brand-white border-brand-black hover:bg-neutral-900"
          : "bg-brand-white text-brand-black border-brand-border hover:border-brand-black hover:bg-brand-surface"
      } ${className}`}
    >
      {added ? (
        <>
          <Check size={14} />
          <span>Agregado</span>
        </>
      ) : isOutOfStock ? (
        <>
          <MessageCircle size={13} />
          <span>Consultar Stock</span>
        </>
      ) : (
        <>
          <ShoppingBag size={14} />
          <span>Agregar</span>
        </>
      )}
    </button>
  );
}
