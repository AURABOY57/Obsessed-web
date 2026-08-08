"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import {
  quickUpdateProductAction,
  quickAdjustStockAction,
  toggleProductStatusAction,
  deleteProductAction,
} from "@/actions/product-actions";
import { Badge } from "@/components/ui/badge";
import { Edit3, Trash2, Eye, EyeOff, Save, Check, Plus, Minus, AlertCircle } from "lucide-react";

import { OfferCountdown } from "@/components/shop/OfferCountdown";
import { removeOfferAction } from "@/actions/product-actions";

interface QuickProductRowProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number | null;
    offerPrice?: number | null;
    offerEndsAt?: string | Date | null;
    offerLabel?: string | null;
    stock: number;
    imageUrl: string;
    isActive: boolean;
    category?: string | null;
    subCategory?: string | null;
    variants?: any;
  };
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export function QuickProductRow({
  product,
  isSelected = false,
  onToggleSelect,
}: QuickProductRowProps) {
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);
  const [isActive, setIsActive] = useState(product.isActive);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const isOfferActive = Boolean(
    product.offerEndsAt &&
      new Date(product.offerEndsAt).getTime() > Date.now() &&
      product.originalPrice &&
      Number(product.originalPrice) > Number(product.price)
  );

  const hasChanges = price !== product.price || stock !== product.stock;
  const isCriticalStock = stock < 2;

  const handleSaveQuick = async () => {
    setIsSaving(true);
    const res = await quickUpdateProductAction(product.id, Number(price), Number(stock));
    setIsSaving(false);
    if (res.success) {
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    }
  };

  const handleAdjustStock = async (delta: number) => {
    const nextStock = Math.max(0, stock + delta);
    setStock(nextStock);
    await quickAdjustStockAction(product.id, delta);
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

  // Variantes formateadas para preview
  let variantText = "";
  if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
    variantText = product.variants
      .map((v: any) => `${v.name}: ${Array.isArray(v.options) ? v.options.join(", ") : ""}`)
      .join(" | ");
  }

  return (
    <div
      className={`border p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
        isSelected
          ? "bg-neutral-100/90 border-brand-black shadow-sm"
          : isOfferActive
          ? "border-amber-400/80 bg-amber-50/10 hover:border-amber-600"
          : isCriticalStock
          ? "border-amber-400/80 hover:border-amber-600 bg-amber-50/20"
          : "border-brand-border hover:border-brand-black bg-brand-white"
      }`}
    >
      {/* Información del Producto con Checkbox */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Cuadradito de Selección */}
        <label className="flex items-center justify-center cursor-pointer p-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect && onToggleSelect(product.id)}
            className="w-4 h-4 rounded-none border border-neutral-400 accent-black cursor-pointer"
          />
        </label>

        <div className="relative w-14 h-14 border border-brand-border flex-shrink-0 bg-brand-surface flex items-center justify-center overflow-hidden">
          {product.imageUrl && product.imageUrl.trim() !== "" ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <span className="text-[8px] font-mono text-neutral-400 text-center uppercase p-1">
              Sin foto
            </span>
          )}
          {isCriticalStock && (
            <div className="absolute top-0 right-0 bg-amber-600 text-brand-white p-0.5" title="Stock bajo (< 2)">
              <AlertCircle size={10} />
            </div>
          )}
        </div>
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/productos/editar/${product.id}`}
              className="text-xs font-semibold text-brand-black uppercase tracking-wider line-clamp-1 hover:underline"
            >
              {product.name}
            </Link>
            <Badge variant={isActive ? "active" : "inactive"}>
              {isActive ? "Activo" : "Oculto"}
            </Badge>
            {isOfferActive && (
              <span className="bg-amber-500 text-black text-[9px] font-mono font-bold px-1.5 py-0.2 tracking-wider">
                🔥 {product.offerLabel || "OFERTA"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-brand-muted">
            <span>{product.category || "General"}</span>
            {product.subCategory && <span>• {product.subCategory}</span>}
            <span>• {formatPrice(price)}</span>
            {isOfferActive && product.originalPrice && (
              <span className="line-through text-neutral-400">
                {formatPrice(Number(product.originalPrice))}
              </span>
            )}
          </div>
          {isOfferActive && (
            <div className="pt-0.5">
              <OfferCountdown endsAt={product.offerEndsAt} compact />
            </div>
          )}
          {variantText && (
            <p className="text-[10px] font-mono text-brand-muted truncate max-w-xs">
              ⚡ {variantText}
            </p>
          )}
        </div>
      </div>

      {/* Controles de Stock en 1 Clic y Precio */}
      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-brand-border">
        <div className="flex items-center gap-2">
          {/* Input de Precio */}
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

          {/* Control de Stock con botones de 1 Clic */}
          <div className="flex items-center border border-brand-border bg-brand-surface">
            <button
              onClick={() => handleAdjustStock(-1)}
              title="Restar 1 unidad"
              className="p-1 hover:bg-neutral-200 text-brand-black transition-colors"
            >
              <Minus size={11} />
            </button>
            <input
              type="number"
              aria-label="Stock"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className={`w-10 text-center bg-transparent text-xs font-mono font-bold focus:outline-none ${
                isCriticalStock ? "text-amber-700" : "text-brand-black"
              }`}
            />
            <button
              onClick={() => handleAdjustStock(1)}
              title="Sumar 1 unidad (+1 clic)"
              className="p-1 hover:bg-neutral-200 text-brand-black transition-colors"
            >
              <Plus size={11} />
            </button>
          </div>

          {/* Botón Guardar Rápido si hay cambios manuales en el input */}
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

        {/* Acciones de Ocultar, Editar y Eliminar */}
        <div className="flex items-center gap-1 border-l border-brand-border pl-2">
          <Link
            href={`/admin/productos/editar/${product.id}`}
            title="Editar producto completo"
            className="p-1.5 text-brand-muted hover:text-brand-black transition-colors"
          >
            <Edit3 size={15} />
          </Link>
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
