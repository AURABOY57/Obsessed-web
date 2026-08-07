"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Check } from "lucide-react";

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
}

export function AddToCartButton({
  product,
  selectedVariant,
  quantity = 1,
  variant = "outline",
  className = "",
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;

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

  const isOutOfStock = product.stock <= 0;

  return (
    <button
      onClick={handleAdd}
      disabled={isOutOfStock}
      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-mono uppercase tracking-widest transition-all cursor-pointer select-none border disabled:opacity-40 disabled:cursor-not-allowed ${
        variant === "primary"
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
        <span>Agotado</span>
      ) : (
        <>
          <ShoppingBag size={14} />
          <span>Agregar al Carrito</span>
        </>
      )}
    </button>
  );
}
