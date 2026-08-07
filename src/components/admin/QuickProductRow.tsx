"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { quickUpdateProductAction, toggleProductStatusAction, deleteProductAction } from "@/actions/product-actions";
import { Badge } from "@/components/ui/badge";
import { Edit3, Trash2, Eye, EyeOff, Save, Check } from "lucide-react";

interface QuickProductRowProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    imageUrl: string;
    isActive: boolean;
    category?: string | null;
    subCategory?: string | null;
  };
}

export function QuickProductRow({ product }: QuickProductRowProps) {
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);
  const [isActive, setIsActive] = useState(product.isActive);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const hasChanges = price !== product.price || stock !== product.stock;

  const handleSaveQuick = async () => {
    setIsSaving(true);
    const res = await quickUpdateProductAction(product.id, Number(price), Number(stock));
    setIsSaving(false);
    if (res.success) {
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    }
  };

  const handleToggleActive = async () => {
    setIsActive(!isActive);
    await toggleProductStatusAction(product.id, isActive);
  };

  const handleDelete = async () => {
    if (confirm(`¿Eliminar definitivamente "${product.name}"?`)) {
      setIsDeleted(true);
      await deleteProductAction(product.id);
    }
  };

  if (isDeleted) return null;

  return (
    <div className="border border-brand-border bg-brand-white p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:border-brand-black">
      {/* Información del Producto */}
      <div className="flex items-center gap-3">
        <div className="relative w-14 h-14 border border-brand-border flex-shrink-0 bg-brand-surface">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-semibold text-brand-black uppercase tracking-wider line-clamp-1">
              {product.name}
            </h4>
            <Badge variant={isActive ? "active" : "inactive"}>
              {isActive ? "Activo" : "Oculto"}
            </Badge>
          </div>
          <p className="text-[11px] font-mono text-brand-muted">
            {product.category || "General"} • {formatPrice(price)}
          </p>
        </div>
      </div>

      {/* Controles Rápidos de Stock y Precio (Móvil / PC) */}
      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-brand-border">
        <div className="flex items-center gap-2">
          {/* Input de Precio Rápido */}
          <div className="flex items-center border border-brand-border px-2 py-1 bg-brand-surface">
            <span className="text-[10px] font-mono text-brand-muted mr-1">$</span>
            <input
              type="number"
              aria-label="Precio"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-16 bg-transparent text-xs font-mono text-brand-black focus:outline-none"
            />
          </div>

          {/* Input de Stock Rápido */}
          <div className="flex items-center border border-brand-border px-2 py-1 bg-brand-surface">
            <span className="text-[10px] font-mono text-brand-muted mr-1">Cant:</span>
            <input
              type="number"
              aria-label="Stock"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-12 bg-transparent text-xs font-mono text-brand-black focus:outline-none"
            />
          </div>

          {/* Botón Guardar Rápido si hay cambios */}
          {hasChanges && (
            <button
              onClick={handleSaveQuick}
              disabled={isSaving}
              className="h-8 px-2.5 bg-brand-black text-brand-white text-xs font-mono flex items-center gap-1 hover:bg-neutral-800"
            >
              {justSaved ? <Check size={13} /> : <Save size={13} />}
              <span className="text-[10px] uppercase">Guardar</span>
            </button>
          )}
        </div>

        {/* Acciones de Ocultar, Editar Completo y Eliminar */}
        <div className="flex items-center gap-1 border-l border-brand-border pl-2">
          <button
            onClick={handleToggleActive}
            title={isActive ? "Ocultar en tienda" : "Mostrar en tienda"}
            className="p-1.5 text-brand-muted hover:text-brand-black transition-colors"
          >
            {isActive ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>
          <button
            onClick={handleDelete}
            title="Eliminar producto"
            className="p-1.5 text-brand-muted hover:text-red-600 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
