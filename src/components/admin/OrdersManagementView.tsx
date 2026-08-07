"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { OrderCard, OrderData } from "@/components/admin/OrderCard";
import { NewOrderModal } from "@/components/admin/NewOrderModal";
import { Search, PlusCircle, ShoppingBag, Filter, X, Clock, PackageCheck, Truck, CheckCircle2 } from "lucide-react";

interface OrdersManagementViewProps {
  initialOrders: OrderData[];
}

const TABS = [
  { id: "ALL", label: "Todos los Pedidos" },
  { id: "PENDING", label: "Pendientes de Pago" },
  { id: "CONFIRMED", label: "En Preparación" },
  { id: "SHIPPED", label: "Enviados" },
  { id: "DELIVERED", label: "Entregados" },
  { id: "CANCELLED", label: "Cancelados" },
];

export function OrdersManagementView({ initialOrders }: OrdersManagementViewProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderData[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Conteo por estado
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: orders.length,
      PENDING: 0,
      CONFIRMED: 0,
      PAID: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };

    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });

    return counts;
  }, [orders]);

  // Filtrar pedidos
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Filtro por tab
      if (activeTab !== "ALL" && order.status !== activeTab) {
        return false;
      }

      // Filtro por búsqueda
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchNumber = order.orderNumber.toLowerCase().includes(q);
        const matchName = order.customerName.toLowerCase().includes(q);
        const matchPhone = order.customerPhone.toLowerCase().includes(q);
        const matchTracking = order.trackingNumber?.toLowerCase().includes(q);
        if (!matchNumber && !matchName && !matchPhone && !matchTracking) {
          return false;
        }
      }

      return true;
    });
  }, [orders, activeTab, searchQuery]);

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-widest font-mono text-brand-black">
            Gestión de Pedidos
          </h1>
          <p className="text-xs font-mono text-brand-muted mt-1">
            Control de órdenes WhatsApp, estados de envío y seguimiento en tiempo real.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-brand-black text-brand-white px-4 py-2.5 text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 transition-colors border border-brand-black self-start sm:self-auto shadow-xs"
        >
          <PlusCircle size={14} />
          <span>+ Nuevo Pedido Manual</span>
        </button>
      </div>

      {/* Barra de Búsqueda */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted"
        />
        <input
          type="text"
          placeholder="Buscar por # de pedido (ej: ORD-2408-...), nombre de cliente, teléfono o guía de envío..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-11 pl-10 pr-10 border border-brand-border bg-brand-white text-xs font-mono text-brand-black placeholder:text-brand-muted focus:border-brand-black focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-black"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Tabs de Filtro por Estado */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-brand-border select-none">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = statusCounts[tab.id] ?? 0;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-colors flex items-center gap-1.5 border-b-2 -mb-[1px] ${
                isActive
                  ? "border-brand-black text-brand-black font-bold bg-neutral-100/50"
                  : "border-transparent text-brand-muted hover:text-brand-black"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? "bg-brand-black text-brand-white font-bold"
                    : "bg-neutral-200/70 text-brand-muted"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Listado de Pedidos */}
      {filteredOrders.length === 0 ? (
        <div className="border border-dashed border-brand-border p-12 text-center space-y-3 bg-brand-white">
          <ShoppingBag size={32} className="mx-auto text-brand-muted" />
          <p className="text-xs font-mono text-brand-muted">
            No se encontraron pedidos con los filtros seleccionados.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveTab("ALL");
            }}
            className="text-xs font-mono uppercase tracking-wider text-brand-black underline"
          >
            Ver todos los pedidos
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onOrderUpdated={handleRefresh}
            />
          ))}
        </div>
      )}

      {/* Modal para Crear Pedido Manual */}
      <NewOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOrderCreated={() => {
          setIsModalOpen(false);
          handleRefresh();
        }}
      />
    </div>
  );
}
