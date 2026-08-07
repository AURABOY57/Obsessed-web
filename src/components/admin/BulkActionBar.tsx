"use client";

import React, { useState } from "react";
import {
  Tag,
  Layers,
  Power,
  Percent,
  Package,
  BadgePercent,
  Trash2,
  X,
  Check,
  ChevronDown,
} from "lucide-react";
import {
  bulkUpdateCategoryAction,
  bulkUpdateStatusAction,
  bulkUpdatePriceAction,
  bulkUpdateStockAction,
  bulkDeleteProductsAction,
} from "@/actions/product-actions";

interface BulkActionBarProps {
  selectedIds: string[];
  onClearSelection: () => void;
  onActionComplete: () => void;
}

export function BulkActionBar({
  selectedIds,
  onClearSelection,
  onActionComplete,
}: BulkActionBarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // States for sub-dialogs/inputs
  const [customPricePercent, setCustomPricePercent] = useState<number>(10);
  const [customFixedPrice, setCustomFixedPrice] = useState<string>("");
  const [customStockValue, setCustomStockValue] = useState<number>(5);

  if (selectedIds.length === 0) return null;

  const count = selectedIds.length;

  const handleCategoryChange = async (cat: string) => {
    setIsProcessing(true);
    await bulkUpdateCategoryAction(selectedIds, cat);
    setIsProcessing(false);
    setActiveMenu(null);
    onActionComplete();
  };

  const handleStatusChange = async (isActive: boolean) => {
    setIsProcessing(true);
    await bulkUpdateStatusAction(selectedIds, isActive);
    setIsProcessing(false);
    setActiveMenu(null);
    onActionComplete();
  };

  const handlePricePercent = async (percent: number) => {
    setIsProcessing(true);
    await bulkUpdatePriceAction(selectedIds, "percentage", percent);
    setIsProcessing(false);
    setActiveMenu(null);
    onActionComplete();
  };

  const handleFixedPrice = async () => {
    const val = Number(customFixedPrice);
    if (isNaN(val) || val <= 0) return;
    setIsProcessing(true);
    await bulkUpdatePriceAction(selectedIds, "fixed", val);
    setIsProcessing(false);
    setActiveMenu(null);
    onActionComplete();
  };

  const handleStockUpdate = async (mode: "set" | "add", val: number) => {
    setIsProcessing(true);
    await bulkUpdateStockAction(selectedIds, mode, val);
    setIsProcessing(false);
    setActiveMenu(null);
    onActionComplete();
  };

  const handleDelete = async () => {
    if (
      confirm(
        `¿Estás seguro de que deseas eliminar ${count} ${
          count === 1 ? "producto" : "productos"
        }? Esta acción no se puede deshacer.`
      )
    ) {
      setIsProcessing(true);
      await bulkDeleteProductsAction(selectedIds);
      setIsProcessing(false);
      onClearSelection();
      onActionComplete();
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-4xl w-[95%] sm:w-auto">
      <div className="bg-[#0f1115] text-brand-white border border-neutral-800 shadow-2xl rounded-none flex items-center flex-wrap px-3 sm:px-4 py-2.5 gap-1.5 sm:gap-2 text-xs font-mono select-none">
        {/* Contador de seleccionados */}
        <div className="flex items-center gap-2 pr-2 border-r border-neutral-700 font-bold text-white whitespace-nowrap">
          <span>{count} seleccionados</span>
        </div>

        {/* Botón Categoría */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setActiveMenu(activeMenu === "category" ? null : "category")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-neutral-800 text-neutral-200 hover:text-white transition-colors cursor-pointer"
          >
            <Tag size={13} className="text-neutral-400" />
            <span>Categoría</span>
            <ChevronDown size={11} className="text-neutral-500" />
          </button>

          {activeMenu === "category" && (
            <div className="absolute bottom-full left-0 mb-2 w-48 bg-[#181a20] border border-neutral-700 shadow-xl p-1.5 space-y-1 z-50">
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider px-2 py-1 border-b border-neutral-800 font-bold">
                Cambiar categoría a:
              </div>
              {["Mates", "Bombillas", "Yerbas", "Termos", "Accesorios"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  disabled={isProcessing}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-neutral-200 hover:bg-neutral-800 hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Botón Estado */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setActiveMenu(activeMenu === "status" ? null : "status")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-neutral-800 text-neutral-200 hover:text-white transition-colors cursor-pointer"
          >
            <Power size={13} className="text-neutral-400" />
            <span>Estado</span>
            <ChevronDown size={11} className="text-neutral-500" />
          </button>

          {activeMenu === "status" && (
            <div className="absolute bottom-full left-0 mb-2 w-44 bg-[#181a20] border border-neutral-700 shadow-xl p-1.5 space-y-1 z-50">
              <button
                onClick={() => handleStatusChange(true)}
                disabled={isProcessing}
                className="w-full text-left px-2.5 py-1.5 text-xs text-green-400 hover:bg-neutral-800 transition-colors flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Marcar como Activo</span>
              </button>
              <button
                onClick={() => handleStatusChange(false)}
                disabled={isProcessing}
                className="w-full text-left px-2.5 py-1.5 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-neutral-600" />
                <span>Pausar / Inactivo</span>
              </button>
            </div>
          )}
        </div>

        {/* Botón % Precio % */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setActiveMenu(activeMenu === "price" ? null : "price")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-neutral-800 text-neutral-200 hover:text-white transition-colors cursor-pointer"
          >
            <Percent size={13} className="text-neutral-400" />
            <span>Precio %</span>
            <ChevronDown size={11} className="text-neutral-500" />
          </button>

          {activeMenu === "price" && (
            <div className="absolute bottom-full left-0 mb-2 w-56 bg-[#181a20] border border-neutral-700 shadow-xl p-2.5 space-y-2.5 z-50">
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">
                Aumentar / Reducir (%)
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[5, 10, 15, 20].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => handlePricePercent(pct)}
                    disabled={isProcessing}
                    className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-xs text-white transition-colors"
                  >
                    +{pct}%
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[-5, -10, -15, -20].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => handlePricePercent(pct)}
                    disabled={isProcessing}
                    className="px-2 py-1 bg-neutral-800/80 hover:bg-neutral-700 text-xs text-amber-300 transition-colors"
                  >
                    {pct}%
                  </button>
                ))}
              </div>

              <div className="border-t border-neutral-700 pt-2 space-y-1.5">
                <span className="text-[10px] text-neutral-400 uppercase">Fijar Precio ($):</span>
                <div className="flex gap-1">
                  <input
                    type="number"
                    placeholder="Ej: 45000"
                    value={customFixedPrice}
                    onChange={(e) => setCustomFixedPrice(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 px-2 py-1 text-xs text-white focus:outline-none"
                  />
                  <button
                    onClick={handleFixedPrice}
                    disabled={isProcessing || !customFixedPrice}
                    className="px-2 py-1 bg-white text-black text-xs font-bold hover:bg-neutral-200"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botón Stock */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setActiveMenu(activeMenu === "stock" ? null : "stock")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-neutral-800 text-neutral-200 hover:text-white transition-colors cursor-pointer"
          >
            <Package size={13} className="text-neutral-400" />
            <span>Stock</span>
            <ChevronDown size={11} className="text-neutral-500" />
          </button>

          {activeMenu === "stock" && (
            <div className="absolute bottom-full left-0 mb-2 w-52 bg-[#181a20] border border-neutral-700 shadow-xl p-2.5 space-y-2.5 z-50">
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">
                Sumar / Restar Unidades:
              </div>
              <div className="grid grid-cols-3 gap-1">
                {[1, 5, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleStockUpdate("add", num)}
                    disabled={isProcessing}
                    className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-xs text-white"
                  >
                    +{num}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-1">
                {[-1, -5, -10].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleStockUpdate("add", num)}
                    disabled={isProcessing}
                    className="px-2 py-1 bg-neutral-800/80 hover:bg-neutral-700 text-xs text-amber-300"
                  >
                    {num}
                  </button>
                ))}
              </div>

              <div className="border-t border-neutral-700 pt-2 space-y-1.5">
                <span className="text-[10px] text-neutral-400 uppercase">Fijar Stock exacto:</span>
                <div className="flex gap-1">
                  <input
                    type="number"
                    min="0"
                    placeholder="Cantidad"
                    value={customStockValue}
                    onChange={(e) => setCustomStockValue(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-700 px-2 py-1 text-xs text-white focus:outline-none"
                  />
                  <button
                    onClick={() => handleStockUpdate("set", customStockValue)}
                    disabled={isProcessing}
                    className="px-2 py-1 bg-white text-black text-xs font-bold hover:bg-neutral-200"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botón Oferta */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setActiveMenu(activeMenu === "offer" ? null : "offer")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-neutral-800 text-neutral-200 hover:text-white transition-colors cursor-pointer"
          >
            <BadgePercent size={13} className="text-neutral-400" />
            <span>Oferta</span>
            <ChevronDown size={11} className="text-neutral-500" />
          </button>

          {activeMenu === "offer" && (
            <div className="absolute bottom-full left-0 mb-2 w-48 bg-[#181a20] border border-neutral-700 shadow-xl p-2 space-y-1.5 z-50">
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">
                Aplicar descuento rápido:
              </div>
              <button
                onClick={() => handlePricePercent(-10)}
                disabled={isProcessing}
                className="w-full text-left px-2 py-1 text-xs text-neutral-200 hover:bg-neutral-800"
              >
                10% OFF Promo
              </button>
              <button
                onClick={() => handlePricePercent(-15)}
                disabled={isProcessing}
                className="w-full text-left px-2 py-1 text-xs text-neutral-200 hover:bg-neutral-800"
              >
                15% OFF Especial
              </button>
              <button
                onClick={() => handlePricePercent(-20)}
                disabled={isProcessing}
                className="w-full text-left px-2 py-1 text-xs text-neutral-200 hover:bg-neutral-800"
              >
                20% OFF Liquidación
              </button>
            </div>
          )}
        </div>

        {/* Botón Eliminar */}
        <button
          type="button"
          onClick={handleDelete}
          disabled={isProcessing}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-red-400 hover:bg-red-950/50 hover:text-red-300 transition-colors cursor-pointer ml-auto"
        >
          <Trash2 size={13} />
          <span>Eliminar</span>
        </button>

        {/* Botón Cerrar / Deseleccionar */}
        <button
          type="button"
          onClick={onClearSelection}
          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors ml-1"
          title="Deseleccionar todo"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
