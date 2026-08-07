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
  Clock,
  Flame,
} from "lucide-react";
import {
  bulkUpdateCategoryAction,
  bulkUpdateStatusAction,
  bulkUpdatePriceAction,
  bulkUpdateStockAction,
  bulkDeleteProductsAction,
  applyCustomOfferAction,
  removeOfferAction,
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

  // States for Ofertas Personalizadas con Duración
  const [offerDiscountPct, setOfferDiscountPct] = useState<number>(20);
  const [offerFixedPrice, setOfferFixedPrice] = useState<string>("");
  const [offerDurationHours, setOfferDurationHours] = useState<number>(24);
  const [offerCustomEndDate, setOfferCustomEndDate] = useState<string>("");
  const [offerTagLabel, setOfferTagLabel] = useState<string>("20% OFF");

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

  const handleApplyOffer = async () => {
    setIsProcessing(true);
    await applyCustomOfferAction(selectedIds, {
      discountPercent: offerFixedPrice ? undefined : offerDiscountPct,
      fixedOfferPrice: offerFixedPrice ? Number(offerFixedPrice) : undefined,
      durationHours: offerCustomEndDate ? undefined : offerDurationHours,
      customEndDate: offerCustomEndDate || undefined,
      label: offerTagLabel,
    });
    setIsProcessing(false);
    setActiveMenu(null);
    onActionComplete();
  };

  const handleRemoveOffer = async () => {
    setIsProcessing(true);
    await removeOfferAction(selectedIds);
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
            <div className="absolute bottom-full left-0 sm:left-auto sm:right-0 mb-2 w-80 sm:w-96 bg-[#181a20] border border-neutral-700 shadow-2xl p-3.5 space-y-3 z-50 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-neutral-700 pb-2">
                <div className="flex items-center gap-1.5 font-bold text-white text-xs uppercase tracking-wider">
                  <Flame size={14} className="text-amber-500" />
                  <span>Oferta con Duración ({count})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveMenu(null)}
                  className="text-neutral-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>

              {/* 1. Selección de Descuento */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                  1. Descuento (%) o Precio de Oferta:
                </label>
                <div className="grid grid-cols-5 gap-1">
                  {[10, 15, 20, 30, 40].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => {
                        setOfferDiscountPct(pct);
                        setOfferFixedPrice("");
                        setOfferTagLabel(`${pct}% OFF`);
                      }}
                      className={`px-1.5 py-1 text-xs transition-colors font-bold ${
                        offerDiscountPct === pct && !offerFixedPrice
                          ? "bg-amber-500 text-black"
                          : "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-[9px] text-neutral-400 block">% Personalizado:</span>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={offerFixedPrice ? "" : offerDiscountPct}
                      onChange={(e) => {
                        setOfferDiscountPct(Number(e.target.value));
                        setOfferFixedPrice("");
                        setOfferTagLabel(`${e.target.value}% OFF`);
                      }}
                      className="w-full bg-neutral-900 border border-neutral-700 px-2 py-1 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-400 block">O Precio Fijo ($):</span>
                    <input
                      type="number"
                      placeholder="Ej: 39999"
                      value={offerFixedPrice}
                      onChange={(e) => {
                        setOfferFixedPrice(e.target.value);
                        setOfferTagLabel("OFERTA ESPECIAL");
                      }}
                      className="w-full bg-neutral-900 border border-neutral-700 px-2 py-1 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Etiqueta Promocional */}
              <div className="space-y-1.5 border-t border-neutral-800 pt-2">
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                  2. Etiqueta / Nombre de la Promo:
                </label>
                <div className="flex flex-wrap gap-1">
                  {["HOT SALE", "FLASH SALE", "FIN DE SEMANA", "LIQUIDACIÓN", "CYBER MATE"].map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setOfferTagLabel(lbl)}
                      className={`text-[10px] px-2 py-0.5 border ${
                        offerTagLabel === lbl
                          ? "border-amber-500 bg-amber-500/20 text-amber-300 font-bold"
                          : "border-neutral-700 bg-neutral-900 text-neutral-400 hover:text-white"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Texto de la etiqueta (ej: 20% OFF)"
                  value={offerTagLabel}
                  onChange={(e) => setOfferTagLabel(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 px-2 py-1 text-xs text-white focus:outline-none"
                />
              </div>

              {/* 3. Duración de la Oferta */}
              <div className="space-y-1.5 border-t border-neutral-800 pt-2">
                <div className="flex items-center gap-1 text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                  <Clock size={11} className="text-amber-500" />
                  <span>3. Duración (Cuenta Regresiva):</span>
                </div>

                <div className="grid grid-cols-3 gap-1">
                  {[
                    { label: "6 Horas", hours: 6 },
                    { label: "12 Horas", hours: 12 },
                    { label: "24 Horas", hours: 24 },
                    { label: "48 Horas", hours: 48 },
                    { label: "3 Días", hours: 72 },
                    { label: "7 Días", hours: 168 },
                  ].map((dur) => (
                    <button
                      key={dur.hours}
                      type="button"
                      onClick={() => {
                        setOfferDurationHours(dur.hours);
                        setOfferCustomEndDate("");
                      }}
                      className={`px-1.5 py-1 text-[11px] transition-colors ${
                        offerDurationHours === dur.hours && !offerCustomEndDate
                          ? "bg-amber-500 text-black font-bold"
                          : "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                      }`}
                    >
                      {dur.label}
                    </button>
                  ))}
                </div>

                <div className="pt-1">
                  <span className="text-[9px] text-neutral-400 block mb-0.5">
                    O Fecha y hora exacta de finalización:
                  </span>
                  <input
                    type="datetime-local"
                    value={offerCustomEndDate}
                    onChange={(e) => setOfferCustomEndDate(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 px-2 py-1 text-xs text-white focus:outline-none [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Botones de Aplicación */}
              <div className="border-t border-neutral-700 pt-2.5 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleRemoveOffer}
                  disabled={isProcessing}
                  className="px-2.5 py-1.5 text-[11px] text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors uppercase"
                >
                  Quitar Oferta
                </button>
                <button
                  type="button"
                  onClick={handleApplyOffer}
                  disabled={isProcessing}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <Flame size={13} />
                  <span>Aplicar Oferta</span>
                </button>
              </div>
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
