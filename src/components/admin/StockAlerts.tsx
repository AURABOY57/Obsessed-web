"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { quickAdjustStockAction } from "@/actions/product-actions";
import { formatPrice } from "@/lib/utils";
import { AlertTriangle, Plus, Check, ArrowRight, ShieldAlert } from "lucide-react";

export interface LowStockProduct {
  id: string;
  name: string;
  slug: string;
  stock: number;
  price: number;
  category?: string | null;
  imageUrl: string;
}

interface StockAlertsProps {
  products: LowStockProduct[];
}

export function StockAlerts({ products }: StockAlertsProps) {
  const [items, setItems] = useState<LowStockProduct[]>(products);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Filtrar estrictamente productos con stock < 2 (0 o 1 unidad)
  const lowStockItems = items.filter((p) => p.stock < 2);

  const handleQuickAddStock = async (id: string, delta: number) => {
    setLoadingId(id);
    const res = await quickAdjustStockAction(id, delta);
    setLoadingId(null);

    if (res.success) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, stock: item.stock + delta } : item
        )
      );
    }
  };

  if (lowStockItems.length === 0) {
    return (
      <div className="border border-green-800/20 bg-green-50/50 p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold shrink-0">
            ✓
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-green-900">
              Inventario en Buen Estado
            </h4>
            <p className="text-[11px] font-mono text-green-800">
              No tienes ningún producto con stock crítico (menor a 2 unidades).
            </p>
          </div>
        </div>
        <Link
          href="/admin/productos"
          className="text-xs font-mono uppercase tracking-wider text-green-900 underline hover:text-green-950 shrink-0"
        >
          Ver catálogo →
        </Link>
      </div>
    );
  }

  return (
    <div className="border-2 border-amber-500 bg-amber-50/40 p-4 sm:p-5 space-y-4">
      {/* Encabezado de la Alerta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-amber-500 text-brand-white">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-950">
              Alerta Crítica: {lowStockItems.length} {lowStockItems.length === 1 ? "Producto con Stock Bajo" : "Productos con Stock Bajo"}
            </h3>
            <p className="text-[11px] font-mono text-amber-800">
              Unidades menores a 2 (agotados o última unidad disponible). Repón stock en 1 clic:
            </p>
          </div>
        </div>

        <Link
          href="/admin/productos?filter=low-stock"
          className="text-xs font-mono uppercase tracking-wider text-amber-900 font-bold hover:underline flex items-center gap-1 self-start sm:self-auto"
        >
          <span>Gestionar todos</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Lista de Productos en Alerta */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {lowStockItems.slice(0, 4).map((product) => {
          const isOut = product.stock <= 0;
          const isLoading = loadingId === product.id;

          return (
            <div
              key={product.id}
              className="border border-amber-300/80 bg-brand-white p-3 flex items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-12 h-12 border border-brand-border bg-brand-surface shrink-0">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-mono font-bold text-brand-black uppercase tracking-wider truncate">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 uppercase ${
                        isOut
                          ? "bg-red-100 text-red-700 border border-red-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {isOut ? "AGOTADO (0)" : "1 RESTANTE"}
                    </span>
                    <span className="text-[11px] font-mono text-brand-muted">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botones de Reposición Rápida en 1 Clic */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleQuickAddStock(product.id, 1)}
                  disabled={isLoading}
                  title="Sumar +1 unidad al stock"
                  className="px-2 py-1 bg-brand-black text-brand-white text-[11px] font-mono hover:bg-neutral-800 border border-brand-black flex items-center gap-1 disabled:opacity-50"
                >
                  <Plus size={11} />
                  <span>+1</span>
                </button>
                <button
                  onClick={() => handleQuickAddStock(product.id, 5)}
                  disabled={isLoading}
                  title="Sumar +5 unidades al stock"
                  className="px-2 py-1 bg-neutral-100 text-brand-black text-[11px] font-mono hover:bg-neutral-200 border border-brand-border flex items-center gap-1 disabled:opacity-50"
                >
                  <Plus size={11} />
                  <span>+5</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
