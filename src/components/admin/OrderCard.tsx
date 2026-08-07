"use client";

import React, { useState } from "react";
import { formatPrice } from "@/lib/utils";
import {
  updateOrderStatusAction,
  updateOrderTrackingAction,
  deleteOrderAction,
} from "@/actions/order-actions";
import { OrderStatus } from "@prisma/client";
import {
  MessageCircle,
  Truck,
  PackageCheck,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Edit2,
  Trash2,
  ExternalLink,
  MapPin,
  Phone,
  Save,
} from "lucide-react";

export interface OrderItemData {
  id?: string;
  name?: string;
  variantName?: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product?: {
    name: string;
    imageUrl?: string;
  };
}

export interface OrderData {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  customerAddress?: string | null;
  shippingCarrier?: string | null;
  trackingNumber?: string | null;
  status: OrderStatus | string;
  total: number;
  paymentMethod?: string | null;
  notes?: string | null;
  createdAt: string | Date;
  items: OrderItemData[];
}

interface OrderCardProps {
  order: OrderData;
  onOrderUpdated?: () => void;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string; icon: any }
> = {
  PENDING: {
    label: "Pendiente de Pago",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-300",
    icon: Clock,
  },
  CONFIRMED: {
    label: "En Preparación",
    bg: "bg-orange-50",
    text: "text-orange-800",
    border: "border-orange-300",
    icon: PackageCheck,
  },
  PAID: {
    label: "Pagado / Listo",
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-300",
    icon: CheckCircle2,
  },
  SHIPPED: {
    label: "Enviado / En Camino",
    bg: "bg-indigo-50",
    text: "text-indigo-800",
    border: "border-indigo-300",
    icon: Truck,
  },
  DELIVERED: {
    label: "Entregado",
    bg: "bg-green-50",
    text: "text-green-800",
    border: "border-green-300",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelado",
    bg: "bg-neutral-100",
    text: "text-neutral-600",
    border: "border-neutral-300",
    icon: XCircle,
  },
};

export function OrderCard({ order, onOrderUpdated }: OrderCardProps) {
  const [currentStatus, setCurrentStatus] = useState<string>(order.status);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showTrackingForm, setShowTrackingForm] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  // Tracking fields
  const [carrier, setCarrier] = useState(order.shippingCarrier || "Correo Argentino");
  const [tracking, setTracking] = useState(order.trackingNumber || "");
  const [notes, setNotes] = useState(order.notes || "");
  const [address, setAddress] = useState(order.customerAddress || "");
  const [isSavingTracking, setIsSavingTracking] = useState(false);

  const statusConfig = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.PENDING;
  const StatusIcon = statusConfig.icon;

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setIsUpdatingStatus(true);
    setCurrentStatus(newStatus);
    await updateOrderStatusAction(order.id, newStatus);
    setIsUpdatingStatus(false);
    if (onOrderUpdated) onOrderUpdated();
  };

  const handleSaveTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingTracking(true);
    await updateOrderTrackingAction(order.id, {
      shippingCarrier: carrier,
      trackingNumber: tracking,
      notes,
      customerAddress: address,
    });
    setIsSavingTracking(false);
    setShowTrackingForm(false);
    if (onOrderUpdated) onOrderUpdated();
  };

  const handleDelete = async () => {
    if (confirm(`¿Eliminar el pedido #${order.orderNumber}?`)) {
      setIsDeleted(true);
      await deleteOrderAction(order.id);
      if (onOrderUpdated) onOrderUpdated();
    }
  };

  // Generador de enlace WhatsApp con mensaje inteligente según el estado
  const cleanPhone = (order.customerPhone || "").replace(/\D/g, "");
  let whatsappPhone = cleanPhone;
  if (cleanPhone.length === 10) {
    whatsappPhone = `549${cleanPhone}`;
  }

  let messageText = `Hola ${order.customerName}! Te escribimos de *obsessed.cba* referente a tu pedido *#${order.orderNumber}*:\n`;
  if (currentStatus === "PENDING") {
    messageText += `\nTotal: *${formatPrice(order.total)}*.\n¿Te gustaría coordinar el pago o envío por acá?`;
  } else if (currentStatus === "CONFIRMED") {
    messageText += `\n¡Ya estamos preparando tu pedido! Te avisaremos apenas esté listo para ser despachado.`;
  } else if (currentStatus === "SHIPPED") {
    messageText += `\n¡Tu pedido ya fue despachado por *${carrier}*!\n${tracking ? `Código de seguimiento: *${tracking}*\n` : ""}¡Que lo disfrutes mucho!`;
  } else if (currentStatus === "DELIVERED") {
    messageText += `\n¡Esperamos que disfrutes tu mate y productos de obsessed.cba! Cualquier consulta estamos a tu disposición.`;
  }
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(messageText)}`;

  const formattedDate = new Date(order.createdAt).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isDeleted) return null;

  return (
    <div className="border border-brand-border bg-brand-white p-4 sm:p-5 space-y-4 hover:border-brand-black transition-colors">
      {/* Encabezado del Pedido */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border pb-3">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold text-brand-black">
                #{order.orderNumber}
              </span>
              <div
                className={`flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
              >
                <StatusIcon size={12} />
                <span>{statusConfig.label}</span>
              </div>
            </div>
            <p className="text-[11px] font-mono text-brand-muted mt-0.5">
              Registrado el {formattedDate}
            </p>
          </div>
        </div>

        {/* Selector Rápido de Estado */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <label className="text-[10px] font-mono uppercase text-brand-muted hidden sm:inline">
            Estado:
          </label>
          <select
            value={currentStatus}
            onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
            disabled={isUpdatingStatus}
            className="h-8 border border-brand-border bg-brand-surface px-2.5 text-xs font-mono font-bold text-brand-black focus:border-brand-black focus:outline-none cursor-pointer"
          >
            <option value="PENDING">🟡 Pendiente de Pago</option>
            <option value="CONFIRMED">🟠 En Preparación</option>
            <option value="PAID">🔵 Pagado / Listo</option>
            <option value="SHIPPED">📦 Enviado</option>
            <option value="DELIVERED">🟢 Entregado</option>
            <option value="CANCELLED">⚪ Cancelado</option>
          </select>
        </div>
      </div>

      {/* Datos del Cliente y Productos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        {/* Columna 1: Cliente */}
        <div className="space-y-1.5 border-b md:border-b-0 md:border-r border-brand-border pb-3 md:pb-0 md:pr-3">
          <p className="text-[10px] uppercase text-brand-muted font-bold tracking-wider">
            Cliente
          </p>
          <p className="font-bold text-brand-black text-sm">{order.customerName}</p>
          <p className="flex items-center gap-1.5 text-brand-muted">
            <Phone size={12} />
            <span>{order.customerPhone}</span>
          </p>
          {address ? (
            <p className="flex items-start gap-1.5 text-brand-muted">
              <MapPin size={12} className="shrink-0 mt-0.5" />
              <span>{address}</span>
            </p>
          ) : (
            <p className="text-[10px] text-brand-muted italic">Sin dirección cargada</p>
          )}
        </div>

        {/* Columna 2: Artículos del Pedido */}
        <div className="space-y-1.5 md:col-span-2">
          <p className="text-[10px] uppercase text-brand-muted font-bold tracking-wider">
            Productos ({order.items.length})
          </p>
          <div className="space-y-1.5">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs py-1 border-b border-dashed border-neutral-100 last:border-0"
              >
                <div className="min-w-0 pr-2">
                  <span className="font-bold text-brand-black">
                    {item.quantity}x{" "}
                  </span>
                  <span className="text-brand-black">
                    {item.product?.name || item.name || "Producto"}
                  </span>
                  {item.variantName && (
                    <span className="text-neutral-500 text-[11px] block sm:inline sm:ml-2">
                      ({item.variantName})
                    </span>
                  )}
                </div>
                <span className="font-bold text-brand-black shrink-0">
                  {formatPrice(item.subtotal || item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-brand-border">
            <span className="font-bold uppercase tracking-wider text-brand-black text-xs">
              Total Pedido
            </span>
            <span className="text-base font-bold text-brand-black">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Datos de Envío & Seguimiento */}
      {(tracking || carrier || order.notes) && (
        <div className="p-3 bg-brand-surface/60 border border-brand-border text-xs font-mono space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-brand-muted font-bold">
              Datos de Despacho:
            </span>
            <button
              onClick={() => setShowTrackingForm(!showTrackingForm)}
              className="text-[10px] text-brand-muted hover:text-brand-black underline"
            >
              Editar
            </button>
          </div>
          <p className="text-brand-black">
            Empresa: <strong>{carrier || "Correo Argentino"}</strong>
            {tracking && (
              <span> • Guía: <strong className="bg-white px-1 border border-brand-border">{tracking}</strong></span>
            )}
          </p>
          {order.notes && (
            <p className="text-[11px] text-brand-muted italic">Notas: {order.notes}</p>
          )}
        </div>
      )}

      {/* Formulario Desplegable para Cargar Seguimiento / Dirección */}
      {showTrackingForm && (
        <form
          onSubmit={handleSaveTracking}
          className="border border-brand-black p-3.5 bg-brand-surface space-y-3"
        >
          <div className="flex items-center justify-between border-b border-brand-border pb-2">
            <span className="text-xs font-mono font-bold uppercase text-brand-black">
              Actualizar Envío y Notas
            </span>
            <button
              type="button"
              onClick={() => setShowTrackingForm(false)}
              className="text-xs text-brand-muted hover:text-brand-black"
            >
              Cerrar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <label className="block text-[10px] uppercase text-brand-muted mb-1">
                Empresa / Medio de Envío
              </label>
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full h-8 border border-brand-border bg-brand-white px-2 text-xs"
              >
                <option value="Correo Argentino">Correo Argentino</option>
                <option value="Andreani">Andreani</option>
                <option value="OCA">OCA</option>
                <option value="Cadetería / Mensajería">Cadetería / Mensajería Local</option>
                <option value="Retiro en Showroom">Retiro en Showroom (Córdoba)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-brand-muted mb-1">
                Número de Guía / Tracking
              </label>
              <input
                type="text"
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                placeholder="Ej: 000049281923"
                className="w-full h-8 border border-brand-border bg-brand-white px-2 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase text-brand-muted mb-1 font-mono">
              Dirección de Entrega
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Calle, Número, Ciudad, Provincia, CP"
              className="w-full h-8 border border-brand-border bg-brand-white px-2 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase text-brand-muted mb-1 font-mono">
              Notas Internas
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Virola grabada con iniciales 'MG'. Pagado por transferencia."
              className="w-full border border-brand-border bg-brand-white p-2 text-xs font-mono"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              disabled={isSavingTracking}
              className="px-3 py-1.5 bg-brand-black text-brand-white text-xs font-mono uppercase tracking-wider flex items-center gap-1"
            >
              <Save size={12} />
              <span>{isSavingTracking ? "Guardando..." : "Guardar Envío"}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowTrackingForm(false)}
              className="px-3 py-1.5 border border-brand-border text-xs font-mono uppercase tracking-wider"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Barra de Acciones: Botón WhatsApp, Datos de Envío y Eliminar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-brand-border">
        <div className="flex items-center gap-2">
          {/* Botón WhatsApp Directo */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] text-white text-xs font-mono font-bold hover:bg-[#20ba5a] transition-colors shadow-xs"
          >
            <MessageCircle size={14} />
            <span>Chat WhatsApp</span>
          </a>

          {!showTrackingForm && (
            <button
              onClick={() => setShowTrackingForm(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-brand-border bg-brand-white text-brand-black text-xs font-mono hover:border-brand-black transition-colors"
            >
              <Truck size={13} />
              <span>{tracking ? "Editar Guía" : "+ Cargar Guía"}</span>
            </button>
          )}
        </div>

        <button
          onClick={handleDelete}
          title="Eliminar pedido"
          className="text-xs font-mono text-brand-muted hover:text-red-600 flex items-center gap-1 p-1"
        >
          <Trash2 size={13} />
          <span className="hidden sm:inline">Eliminar</span>
        </button>
      </div>
    </div>
  );
}
