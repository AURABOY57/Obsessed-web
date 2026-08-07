"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { QuickProductRow } from "@/components/admin/QuickProductRow";
import { BulkActionBar } from "@/components/admin/BulkActionBar";
import { Search, PlusCircle, AlertTriangle, Package, Filter, X, CheckSquare, Square } from "lucide-react";

export interface InventoryProduct {
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
}

interface ProductInventoryViewProps {
  initialProducts: InventoryProduct[];
  initialFilter?: string;
}

const CATEGORIES = ["TODOS", "Mates", "Bombillas", "Yerbas", "Termos", "Accesorios", "STOCK BAJO (< 2)"];

const SUBFILTERS_BY_CATEGORY: Record<string, string[]> = {
  Mates: ["Todos los mates", "Calabaza", "Madera", "Acero", "Cerámica", "Imperial", "Torpedo", "Camionero"],
  Bombillas: ["Todas las bombillas", "Alpaca", "Acero", "Pico de Loro", "Resorte"],
  Yerbas: ["Todas las yerbas", "Con Palo", "Despalada", "Compuesta"],
  Termos: ["Todos los termos", "Acero Inox", "1L", "Pico Cebador"],
};

export function ProductInventoryView({ initialProducts, initialFilter }: ProductInventoryViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialFilter === "low-stock" ? "STOCK BAJO (< 2)" : "TODOS"
  );
  const [selectedSubfilter, setSelectedSubfilter] = useState<string>("TODOS");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Conteo por categoría
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      TODOS: initialProducts.length,
      "STOCK BAJO (< 2)": initialProducts.filter((p) => p.stock < 2).length,
    };

    initialProducts.forEach((p) => {
      const cat = p.category?.trim() || "Otros";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return counts;
  }, [initialProducts]);

  // Filtrado reactivo en tiempo real
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // 1. Filtro por categoría principal
      if (selectedCategory === "STOCK BAJO (< 2)") {
        if (product.stock >= 2) return false;
      } else if (selectedCategory !== "TODOS") {
        if (product.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // 2. Filtro por subfiltro
      if (selectedSubfilter !== "TODOS" && !selectedSubfilter.startsWith("Tod")) {
        const sub = selectedSubfilter.toLowerCase();
        const matchSub = product.subCategory?.toLowerCase().includes(sub);
        const matchName = product.name.toLowerCase().includes(sub);
        if (!matchSub && !matchName) return false;
      }

      // 3. Barra de búsqueda por texto
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = product.name.toLowerCase().includes(query);
        const matchCat = product.category?.toLowerCase().includes(query);
        const matchSub = product.subCategory?.toLowerCase().includes(query);
        if (!matchName && !matchCat && !matchSub) return false;
      }

      return true;
    });
  }, [initialProducts, selectedCategory, selectedSubfilter, searchQuery]);

  const activeSubfilters = SUBFILTERS_BY_CATEGORY[selectedCategory];

  // Manejo de Selección Múltiple
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isAllFilteredSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((p) => selectedIds.includes(p.id));

  const handleToggleSelectAll = () => {
    if (isAllFilteredSelected) {
      // Deseleccionar los visibles
      const filteredIds = new Set(filteredProducts.map((p) => p.id));
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.has(id)));
    } else {
      // Seleccionar todos los visibles
      const filteredIds = filteredProducts.map((p) => p.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Encabezado y Acción Primaria */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-widest font-mono text-brand-black">
            Gestión de Inventario
          </h1>
          <p className="text-xs font-mono text-brand-muted mt-1">
            Total en catálogo: {initialProducts.length} productos | {filteredProducts.length} visibles
            {selectedIds.length > 0 && (
              <span className="text-brand-black font-bold ml-2">
                ({selectedIds.length} seleccionados)
              </span>
            )}
          </p>
        </div>

        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center justify-center gap-2 bg-brand-black text-brand-white px-4 py-2.5 text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 transition-colors border border-brand-black self-start sm:self-auto"
        >
          <PlusCircle size={14} />
          <span>+ Cargar Producto</span>
        </Link>
      </div>

      {/* Barra de Búsqueda en Tiempo Real */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted"
        />
        <input
          type="text"
          placeholder="Buscar por nombre, categoría (ej. mate imperial, alpaca, termo)..."
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

      {/* Pestañas de Categoría Principal */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-brand-border select-none">
        {CATEGORIES.map((cat) => {
          const isLowStockTab = cat.includes("STOCK BAJO");
          const isActive = selectedCategory === cat;
          const count = categoryCounts[cat] ?? 0;

          return (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedSubfilter("TODOS");
              }}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-colors flex items-center gap-1.5 border-b-2 -mb-[1px] ${
                isActive
                  ? isLowStockTab
                    ? "border-amber-600 text-amber-700 font-bold bg-amber-50"
                    : "border-brand-black text-brand-black font-bold bg-neutral-100/50"
                  : isLowStockTab
                  ? "border-transparent text-amber-800 hover:text-amber-900"
                  : "border-transparent text-brand-muted hover:text-brand-black"
              }`}
            >
              {isLowStockTab && <AlertTriangle size={12} className="text-amber-600" />}
              <span>{cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? isLowStockTab
                      ? "bg-amber-200 text-amber-900 font-bold"
                      : "bg-brand-black text-brand-white font-bold"
                    : "bg-neutral-200/70 text-brand-muted"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Subfiltros Específicos por Tipo (Mates: calabaza, madera, acero, etc.) */}
      {activeSubfilters && activeSubfilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[11px] font-mono text-brand-muted uppercase flex items-center gap-1">
            <Filter size={11} />
            Tipo:
          </span>
          {activeSubfilters.map((sub) => {
            const isSubActive =
              (selectedSubfilter === "TODOS" && sub.startsWith("Tod")) ||
              selectedSubfilter === sub;

            return (
              <button
                key={sub}
                onClick={() => setSelectedSubfilter(sub.startsWith("Tod") ? "TODOS" : sub)}
                className={`text-[11px] font-mono px-2.5 py-1 border transition-colors ${
                  isSubActive
                    ? "bg-brand-black text-brand-white border-brand-black font-semibold"
                    : "bg-brand-white text-brand-muted hover:text-brand-black border-brand-border"
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      )}

      {/* Barra de Selección Masiva Rápida en Cabecera */}
      {filteredProducts.length > 0 && (
        <div className="flex items-center justify-between px-3 py-2 bg-brand-surface border border-brand-border text-xs font-mono">
          <label className="flex items-center gap-2 cursor-pointer select-none text-brand-black">
            <input
              type="checkbox"
              checked={isAllFilteredSelected}
              onChange={handleToggleSelectAll}
              className="w-4 h-4 rounded-none border border-neutral-400 accent-black cursor-pointer"
            />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {isAllFilteredSelected ? "Deseleccionar todos" : "Seleccionar todos los visibles"} ({filteredProducts.length})
            </span>
          </label>

          {selectedIds.length > 0 && (
            <button
              onClick={() => setSelectedIds([])}
              className="text-[11px] text-brand-muted hover:text-brand-black underline uppercase"
            >
              Limpiar selección ({selectedIds.length})
            </button>
          )}
        </div>
      )}

      {/* Listado de Productos con Checkboxes y Ajuste de Stock en 1 Clic */}
      {filteredProducts.length === 0 ? (
        <div className="border border-dashed border-brand-border p-12 text-center space-y-3">
          <Package size={32} className="mx-auto text-brand-muted" />
          <p className="text-xs font-mono text-brand-muted">
            No se encontraron productos con los filtros seleccionados.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("TODOS");
              setSelectedSubfilter("TODOS");
            }}
            className="text-xs font-mono uppercase tracking-wider text-brand-black underline"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredProducts.map((product) => (
            <QuickProductRow
              key={product.id}
              product={product}
              isSelected={selectedIds.includes(product.id)}
              onToggleSelect={handleToggleSelect}
            />
          ))}
        </div>
      )}

      {/* Barra Flotante de Acciones Masivas (Sticky Bottom Bar) */}
      <BulkActionBar
        selectedIds={selectedIds}
        onClearSelection={() => setSelectedIds([])}
        onActionComplete={() => {
          setSelectedIds([]);
        }}
      />
    </div>
  );
}

