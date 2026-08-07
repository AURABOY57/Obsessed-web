"use client";

import React, { useState } from "react";
import { createOrderAction, OrderItemInput } from "@/actions/order-actions";
import { OrderStatus } from "@prisma/client";
import { formatPrice } from "@/lib/utils";
import { Plus, Trash2, X, ShoppingCart, User, Phone, MapPin } from "lucide-react";

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated?: () => void;
}

export function NewOrderModal({ isOpen, onClose, onOrderCreated }: NewOrderModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [shippingCarrier, setShippingCarrier] = useState("Correo Argentino");
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.PENDING);
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState<OrderItemInput[]>([
    { name: "Mate Imperial Premium Noir", variantName: "Virola Cincelada", quantity: 1, unitPrice: 48000 },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { name: "Bombilla Alpaca", variantName: "", quantity: 1, unitPrice: 18500 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    field: keyof OrderItemInput,
    value: any
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const total = items.reduce((acc, it) => acc + (Number(it.unitPrice) || 0) * (Number(it.quantity) || 1), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim()) {
      setErrorMessage("Ingresa el nombre del cliente.");
      return;
    }
    if (!customerPhone.trim()) {
      setErrorMessage("Ingresa el teléfono o WhatsApp del cliente.");
      return;
    }
    if (items.length === 0) {
      setErrorMessage("Agrega al menos un producto.");
      return;
    }

    setIsSubmitting(true);
    const res = await createOrderAction({
      customerName,
      customerPhone,
      customerAddress: customerAddress || undefined,
      shippingCarrier: shippingCarrier || undefined,
      status,
      notes: notes || undefined,
      items: items.map((it) => ({
        ...it,
        unitPrice: Number(it.unitPrice),
        quantity: Number(it.quantity),
      })),
    });

    setIsSubmitting(false);

    if (res.success) {
      onClose();
      if (onOrderCreated) onOrderCreated();
    } else {
      setErrorMessage(res.message || "Error al crear el pedido.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-brand-white border border-brand-black w-full max-w-xl my-8 p-6 shadow-2xl relative">
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-brand-border pb-4 mb-4">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-brand-black" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-brand-black">
              Registrar Nuevo Pedido Manual
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-brand-muted hover:text-brand-black transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 border border-red-500 bg-red-50 text-red-700 text-xs font-mono">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Datos del Cliente */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <label className="block text-[10px] uppercase text-brand-muted mb-1 font-bold">
                Nombre del Cliente *
              </label>
              <div className="flex items-center border border-brand-border px-2.5 py-1.5 bg-brand-surface">
                <User size={13} className="text-brand-muted mr-1.5" />
                <input
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full bg-transparent text-xs text-brand-black focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-brand-muted mb-1 font-bold">
                Teléfono / WhatsApp *
              </label>
              <div className="flex items-center border border-brand-border px-2.5 py-1.5 bg-brand-surface">
                <Phone size={13} className="text-brand-muted mr-1.5" />
                <input
                  type="text"
                  placeholder="Ej: 3514567890"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                  className="w-full bg-transparent text-xs text-brand-black focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <label className="block text-[10px] uppercase text-brand-muted mb-1 font-bold">
                Dirección / Destino
              </label>
              <div className="flex items-center border border-brand-border px-2.5 py-1.5 bg-brand-surface">
                <MapPin size={13} className="text-brand-muted mr-1.5" />
                <input
                  type="text"
                  placeholder="Ciudad, Calle, CP"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full bg-transparent text-xs text-brand-black focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-brand-muted mb-1 font-bold">
                Estado Inicial
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="w-full h-9 border border-brand-border bg-brand-surface px-2 text-xs font-mono font-semibold"
              >
                <option value="PENDING">🟡 Pendiente de Pago</option>
                <option value="CONFIRMED">🟠 En Preparación</option>
                <option value="PAID">🔵 Pagado / Listo</option>
                <option value="SHIPPED">📦 Enviado</option>
              </select>
            </div>
          </div>

          {/* Artículos del Pedido */}
          <div className="border border-brand-border p-3.5 bg-brand-surface/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-black">
                Productos del Pedido
              </span>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-brand-black text-brand-white flex items-center gap-1"
              >
                <Plus size={11} />
                <span>+ Agregar Producto</span>
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-mono bg-white p-2 border border-brand-border">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Producto"
                      value={item.name}
                      onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                      className="w-full border-b border-neutral-200 pb-0.5 text-xs font-semibold focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Variante (ej. Virola Cincelada)"
                      value={item.variantName || ""}
                      onChange={(e) => handleItemChange(idx, "variantName", e.target.value)}
                      className="w-full text-[10px] text-brand-muted mt-1 focus:outline-none"
                    />
                  </div>

                  <div className="w-14">
                    <input
                      type="number"
                      min="1"
                      placeholder="Cant"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, "quantity", Number(e.target.value))}
                      className="w-full text-center border border-brand-border py-1 text-xs"
                    />
                  </div>

                  <div className="w-24">
                    <input
                      type="number"
                      min="0"
                      placeholder="Precio"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(idx, "unitPrice", Number(e.target.value))}
                      className="w-full text-right border border-brand-border py-1 px-1.5 text-xs"
                    />
                  </div>

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="text-brand-muted hover:text-red-600 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-brand-border text-xs font-mono">
              <span className="font-bold text-brand-black uppercase">Total a Cobrar:</span>
              <span className="text-sm font-bold text-brand-black">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-[10px] uppercase text-brand-muted mb-1 font-mono">
              Notas Adicionales (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ej: Comprador de Instagram @mate_fan"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-8 border border-brand-border bg-brand-surface px-2 text-xs font-mono"
            />
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-brand-border text-xs font-mono uppercase tracking-wider hover:border-brand-black"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-brand-black text-brand-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50"
            >
              {isSubmitting ? "Creando..." : "Crear Pedido"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
