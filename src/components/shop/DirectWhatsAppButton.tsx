"use client";

import React from "react";
import { buildWhatsAppLink, buildStockInquiryWhatsAppLink } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

interface DirectWhatsAppButtonProps {
  product: {
    name: string;
    price: number;
  };
  quantity?: number;
  variantName?: string;
  isOutOfStock?: boolean;
  className?: string;
  label?: string;
}

export function DirectWhatsAppButton({
  product,
  quantity = 1,
  variantName,
  isOutOfStock = false,
  className = "",
  label,
}: DirectWhatsAppButtonProps) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "5493548550965";

  const handleDirectWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isOutOfStock) {
      const url = buildStockInquiryWhatsAppLink({
        phone,
        productName: product.name,
        variantName,
      });
      window.open(url, "_blank");
      return;
    }

    const url = buildWhatsAppLink({
      phone,
      products: [
        {
          name: product.name,
          variantName,
          quantity,
          price: product.price,
        },
      ],
      total: product.price * quantity,
    });
    window.open(url, "_blank");
  };

  const defaultLabel = isOutOfStock ? "Consultar Stock" : "Pedir por WhatsApp";
  const displayLabel = label || defaultLabel;

  return (
    <button
      onClick={handleDirectWhatsApp}
      className={`inline-flex items-center justify-center gap-2 border border-brand-black bg-brand-black text-brand-white px-4 py-2.5 text-xs font-mono uppercase tracking-widest hover:bg-brand-white hover:text-brand-black transition-colors cursor-pointer ${className}`}
    >
      <MessageCircle size={14} />
      <span>{displayLabel}</span>
    </button>
  );
}
