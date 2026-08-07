"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { buildWhatsAppLink } from "@/lib/utils";

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  quantity: number;
  stock: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  totalItems: number;
  getWhatsAppCheckoutUrl: (customerName?: string) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar carrito desde localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("obsessed_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("[Cart] Error al leer localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Guardar carrito en localStorage al cambiar
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("obsessed_cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = (product: Omit<CartItem, "quantity">, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        const nextQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: nextQty } : item
        );
      }
      return [...prev, { ...product, quantity: Math.min(quantity, product.stock) }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.min(quantity, item.stock) } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const getWhatsAppCheckoutUrl = (customerName?: string) => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "5493548550965";
    return buildWhatsAppLink({
      phone,
      products: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total,
      customerName,
    });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        setIsOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        totalItems,
        getWhatsAppCheckoutUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
}
