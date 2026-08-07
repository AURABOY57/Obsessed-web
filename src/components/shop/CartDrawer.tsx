"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { X, Trash2, Plus, Minus, MessageCircle, ArrowRight } from "lucide-react";

export function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeItem,
    clearCart,
    total,
    getWhatsAppCheckoutUrl,
  } = useCart();

  const [customerName, setCustomerName] = useState("");

  if (!isOpen) return null;

  const handleCheckoutWhatsApp = () => {
    const url = getWhatsAppCheckoutUrl(customerName);
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Fondo Oscuro / Backdrop */}
      <div
        className="absolute inset-0 bg-brand-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-brand-white border-l border-brand-black flex flex-col justify-between shadow-2xl">
          {/* Header del Carrito */}
          <div className="p-5 border-b border-brand-border flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold uppercase tracking-widest font-mono text-brand-black">
                Carrito de Compras
              </h2>
              <p className="text-[11px] font-mono text-brand-muted">
                {items.length} {items.length === 1 ? "artículo" : "artículos"}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-brand-muted hover:text-brand-black border border-transparent hover:border-brand-border transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Lista de Productos */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                <p className="text-xs font-mono text-brand-muted uppercase tracking-wider">
                  Tu carrito está vacío
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-brand-black text-brand-black text-xs font-mono uppercase tracking-widest hover:bg-brand-black hover:text-brand-white transition-colors"
                >
                  Explorar Colección
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 pb-4 border-b border-brand-border"
                >
                  <div className="relative w-16 h-20 border border-brand-border bg-brand-surface flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/productos/${item.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="text-xs font-bold font-mono text-brand-black hover:underline uppercase tracking-wider line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-brand-muted hover:text-red-600 transition-colors p-0.5"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <p className="text-xs font-mono text-brand-black mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Controles de Cantidad */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-brand-border">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-brand-black hover:bg-brand-surface transition-colors"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-7 text-center text-xs font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="p-1 text-brand-black hover:bg-brand-surface disabled:opacity-30 transition-colors"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      <span className="text-xs font-mono font-semibold text-brand-black">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer del Carrito & Checkout por WhatsApp */}
          {items.length > 0 && (
            <div className="p-5 border-t border-brand-black bg-brand-surface space-y-4">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase font-mono tracking-widest text-brand-muted">
                  Tu Nombre (opcional para el mensaje):
                </label>
                <input
                  type="text"
                  placeholder="Ej: Sofía Martínez"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full h-9 border border-brand-border bg-brand-white px-3 text-xs font-sans text-brand-black focus:border-brand-black focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 pt-2 border-t border-brand-border">
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider">
                  <span className="text-brand-muted">Subtotal</span>
                  <span className="font-bold text-brand-black">{formatPrice(total)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-brand-muted">
                  <span>Envío & Pago</span>
                  <span>A coordinar vía WhatsApp</span>
                </div>
              </div>

              {/* Botón WhatsApp Checkout Principal */}
              <button
                onClick={handleCheckoutWhatsApp}
                className="w-full h-12 bg-brand-black text-brand-white flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest hover:bg-neutral-900 border border-brand-black transition-all active:scale-[0.99] cursor-pointer"
              >
                <MessageCircle size={16} />
                <span>Comprar por WhatsApp</span>
                <ArrowRight size={14} />
              </button>

              <div className="flex items-center justify-between text-[10px] font-mono text-brand-muted">
                <button
                  onClick={clearCart}
                  className="underline hover:text-brand-black"
                >
                  Vaciar carrito
                </button>
                <span>obsessed.cba</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
