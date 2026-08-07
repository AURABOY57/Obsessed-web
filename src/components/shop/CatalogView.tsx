"use client";

import React, { useState, useMemo } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
  Check,
  PackageCheck,
  ArrowUpDown,
} from "lucide-react";

export interface ProductItem {
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
  category?: string | null;
  subCategory?: string | null;
}

interface CatalogViewProps {
  initialProducts: ProductItem[];
}

export function CatalogView({ initialProducts }: CatalogViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("TODOS");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [priceRange, setPriceRange] = useState<number | null>(null);

  // Estados de los desplegables de la barra lateral
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isSortOpen, setIsSortOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isStockOpen, setIsStockOpen] = useState(true);

  // Estado del drawer de filtros en móvil
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Calcular precio máximo para el slider
  const maxProductPrice = useMemo(() => {
    if (initialProducts.length === 0) return 100000;
    const max = Math.max(...initialProducts.map((p) => p.price));
    return Math.ceil(max / 5000) * 5000;
  }, [initialProducts]);

  // Conteo dinámico por categoría
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { TODOS: initialProducts.length };
    initialProducts.forEach((p) => {
      const cat = p.category?.trim() || "Otros";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [initialProducts]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach((p) => {
      if (p.category) {
        set.add(p.category.trim());
      }
    });
    return ["TODOS", ...Array.from(set)];
  }, [initialProducts]);

  // Filtrado y ordenamiento en tiempo real
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        // Filtro por búsqueda
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(query);
          const matchCat = product.category?.toLowerCase().includes(query);
          if (!matchName && !matchCat) return false;
        }

        // Filtro por categoría
        if (selectedCategory !== "TODOS") {
          if (product.category?.toUpperCase() !== selectedCategory.toUpperCase()) {
            return false;
          }
        }

        // Filtro solo con stock
        if (onlyInStock && product.stock <= 0) {
          return false;
        }

        // Filtro por precio máximo
        if (priceRange !== null && product.price > priceRange) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0; // featured / default order
      });
  }, [initialProducts, searchQuery, selectedCategory, sortBy, onlyInStock, priceRange]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery !== "") count++;
    if (selectedCategory !== "TODOS") count++;
    if (sortBy !== "featured") count++;
    if (onlyInStock) count++;
    if (priceRange !== null) count++;
    return count;
  }, [searchQuery, selectedCategory, sortBy, onlyInStock, priceRange]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("TODOS");
    setSortBy("featured");
    setOnlyInStock(false);
    setPriceRange(null);
  };

  // Contenido de los filtros (reutilizado en sidebar desktop y drawer mobile)
  const renderFilterSections = () => (
    <div className="space-y-6">
      {/* 1. Buscador */}
      <div className="space-y-2">
        <label className="text-[11px] font-mono uppercase tracking-widest text-brand-black font-semibold flex items-center gap-1.5">
          <Search size={13} />
          <span>Buscar</span>
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar modelo o pieza..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-8 pr-7 border border-brand-border bg-brand-surface text-xs font-mono text-brand-black placeholder:text-brand-muted focus:border-brand-black focus:bg-brand-white focus:outline-none transition-all"
          />
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-muted"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-black"
              aria-label="Limpiar búsqueda"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      <div className="h-px bg-brand-border" />

      {/* 2. Desplegable de Categorías */}
      <div className="space-y-3">
        <button
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          className="w-full flex items-center justify-between text-left group"
        >
          <span className="text-[11px] font-mono uppercase tracking-widest text-brand-black font-semibold group-hover:text-brand-muted transition-colors">
            Categorías
          </span>
          <ChevronDown
            size={14}
            className={`text-brand-black transition-transform duration-200 ${
              isCategoryOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isCategoryOpen && (
          <div className="space-y-1.5 pt-1 animate-fadeIn">
            {categories.map((cat) => {
              const isSelected = selectedCategory.toUpperCase() === cat.toUpperCase();
              const count = categoryCounts[cat] || 0;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-mono uppercase tracking-wider transition-all rounded-sm ${
                    isSelected
                      ? "bg-brand-black text-brand-white font-semibold shadow-xs"
                      : "text-brand-muted hover:text-brand-black hover:bg-neutral-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isSelected && <Check size={12} className="stroke-[3]" />}
                    {cat}
                  </span>
                  <span
                    className={`text-[10px] ${
                      isSelected ? "text-neutral-300" : "text-brand-muted"
                    }`}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="h-px bg-brand-border" />

      {/* 3. Desplegable de Ordenamiento */}
      <div className="space-y-3">
        <button
          onClick={() => setIsSortOpen(!isSortOpen)}
          className="w-full flex items-center justify-between text-left group"
        >
          <span className="text-[11px] font-mono uppercase tracking-widest text-brand-black font-semibold group-hover:text-brand-muted transition-colors">
            Ordenar Por
          </span>
          <ChevronDown
            size={14}
            className={`text-brand-black transition-transform duration-200 ${
              isSortOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isSortOpen && (
          <div className="space-y-1 pt-1 animate-fadeIn">
            {[
              { id: "featured", label: "Destacados" },
              { id: "price-asc", label: "Precio: Menor a Mayor" },
              { id: "price-desc", label: "Precio: Mayor a Menor" },
              { id: "name", label: "Nombre: A - Z" },
            ].map((option) => {
              const isSelected = sortBy === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id as any)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-mono uppercase tracking-wider transition-all rounded-sm ${
                    isSelected
                      ? "bg-brand-black text-brand-white font-semibold"
                      : "text-brand-muted hover:text-brand-black hover:bg-neutral-100"
                  }`}
                >
                  <span>{option.label}</span>
                  {isSelected && <Check size={12} className="stroke-[3]" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="h-px bg-brand-border" />

      {/* 4. Desplegable de Rango de Precios */}
      <div className="space-y-3">
        <button
          onClick={() => setIsPriceOpen(!isPriceOpen)}
          className="w-full flex items-center justify-between text-left group"
        >
          <span className="text-[11px] font-mono uppercase tracking-widest text-brand-black font-semibold group-hover:text-brand-muted transition-colors">
            Precio Máximo
          </span>
          <ChevronDown
            size={14}
            className={`text-brand-black transition-transform duration-200 ${
              isPriceOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isPriceOpen && (
          <div className="space-y-3 pt-1 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-brand-muted">Hasta:</span>
              <span className="font-bold text-brand-black">
                ${(priceRange ?? maxProductPrice).toLocaleString("es-AR")}
              </span>
            </div>
            <input
              type="range"
              min={10000}
              max={maxProductPrice}
              step={5000}
              value={priceRange ?? maxProductPrice}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-black cursor-pointer h-1.5 bg-neutral-200 rounded-lg"
            />
            {priceRange !== null && (
              <button
                onClick={() => setPriceRange(null)}
                className="text-[10px] font-mono uppercase tracking-wider text-brand-muted hover:text-brand-black underline"
              >
                Restablecer precio
              </button>
            )}
          </div>
        )}
      </div>

      <div className="h-px bg-brand-border" />

      {/* 5. Desplegable de Disponibilidad / Stock */}
      <div className="space-y-3">
        <button
          onClick={() => setIsStockOpen(!isStockOpen)}
          className="w-full flex items-center justify-between text-left group"
        >
          <span className="text-[11px] font-mono uppercase tracking-widest text-brand-black font-semibold group-hover:text-brand-muted transition-colors">
            Disponibilidad
          </span>
          <ChevronDown
            size={14}
            className={`text-brand-black transition-transform duration-200 ${
              isStockOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isStockOpen && (
          <div className="pt-1 animate-fadeIn">
            <label className="flex items-center gap-2.5 text-xs font-mono uppercase tracking-wider text-brand-black cursor-pointer select-none p-2 rounded-sm hover:bg-neutral-100 transition-colors">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 accent-black cursor-pointer rounded-xs"
              />
              <span className="flex items-center gap-1.5">
                <PackageCheck size={14} className="text-brand-muted" />
                <span>Solo con stock</span>
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Botón de limpiar filtros en sidebar */}
      {activeFiltersCount > 0 && (
        <div className="pt-2">
          <button
            onClick={handleResetFilters}
            className="w-full py-2.5 px-3 border border-brand-black bg-brand-white text-brand-black text-[11px] font-mono uppercase tracking-widest hover:bg-brand-black hover:text-brand-white transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <RotateCcw size={12} />
            <span>Limpiar Filtros ({activeFiltersCount})</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Barra de Control Superior para Mobile & Tablets (<lg) */}
      <div className="lg:hidden flex items-center justify-between gap-3 border border-brand-border bg-brand-surface p-3">
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-brand-black text-brand-white text-xs font-mono uppercase tracking-widest hover:bg-neutral-900 transition-all shadow-xs"
        >
          <SlidersHorizontal size={14} />
          <span>Filtros y Desplegables</span>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-brand-white text-brand-black text-[10px] font-bold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Dropdown Rápido de Orden en Móvil */}
        <div className="flex items-center border border-brand-border bg-brand-white px-2.5 h-10">
          <ArrowUpDown size={13} className="text-brand-muted mr-1.5 flex-shrink-0" />
          <select
            aria-label="Ordenar productos"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-[11px] font-mono uppercase tracking-wider text-brand-black focus:outline-none cursor-pointer"
          >
            <option value="featured">Destacados</option>
            <option value="price-asc">$ Menor</option>
            <option value="price-desc">$ Mayor</option>
            <option value="name">A - Z</option>
          </select>
        </div>
      </div>

      {/* Tags de Filtros Activos (Píldoras Removibles) */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-muted mr-1">
            Filtros:
          </span>

          {selectedCategory !== "TODOS" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-black text-brand-white text-[10px] font-mono uppercase tracking-wider">
              Categoría: {selectedCategory}
              <button
                onClick={() => setSelectedCategory("TODOS")}
                className="hover:text-red-300 ml-0.5"
                aria-label="Quitar filtro de categoría"
              >
                <X size={11} />
              </button>
            </span>
          )}

          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-surface border border-brand-border text-brand-black text-[10px] font-mono uppercase tracking-wider">
              &quot;{searchQuery}&quot;
              <button
                onClick={() => setSearchQuery("")}
                className="hover:text-brand-muted ml-0.5"
                aria-label="Quitar búsqueda"
              >
                <X size={11} />
              </button>
            </span>
          )}

          {priceRange !== null && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-surface border border-brand-border text-brand-black text-[10px] font-mono uppercase tracking-wider">
              Hasta ${priceRange.toLocaleString("es-AR")}
              <button
                onClick={() => setPriceRange(null)}
                className="hover:text-brand-muted ml-0.5"
                aria-label="Quitar filtro de precio"
              >
                <X size={11} />
              </button>
            </span>
          )}

          {onlyInStock && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950 text-emerald-100 text-[10px] font-mono uppercase tracking-wider">
              Solo con stock
              <button
                onClick={() => setOnlyInStock(false)}
                className="hover:text-red-300 ml-0.5"
                aria-label="Quitar filtro de stock"
              >
                <X size={11} />
              </button>
            </span>
          )}

          <button
            onClick={handleResetFilters}
            className="text-[10px] font-mono uppercase tracking-wider text-brand-muted hover:text-brand-black underline ml-2"
          >
            Limpiar todos
          </button>
        </div>
      )}

      {/* Estructura Principal: Sidebar a la Izquierda + Grid de Productos a la Derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================================= */}
        {/* SIDEBAR DE FILTROS IZQUIERDA (DESKTOP)                                    */}
        {/* ========================================================================= */}
        <aside aria-label="Filtros del catálogo" className="hidden lg:block lg:col-span-3 sticky top-24 border border-brand-border bg-brand-white p-5 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-brand-black flex items-center gap-2">
              <SlidersHorizontal size={14} />
              <span>Filtros</span>
            </h3>
            {activeFiltersCount > 0 && (
              <span className="text-[10px] font-mono uppercase tracking-wider bg-brand-surface px-2 py-0.5 border border-brand-border">
                {activeFiltersCount} activo{activeFiltersCount > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {renderFilterSections()}
        </aside>

        {/* ========================================================================= */}
        {/* GRID DE PRODUCTOS (DERECHA)                                               */}
        {/* ========================================================================= */}
        <main className="lg:col-span-9 space-y-6">
          {/* Barra de Conteo y Encabezado */}
          <div className="flex items-center justify-between border-b border-brand-border pb-3 text-xs font-mono">
            <span className="text-brand-black font-semibold uppercase tracking-wider">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "Pieza Encontrada" : "Piezas Encontradas"}
            </span>

            <span className="hidden sm:inline-block text-[11px] text-brand-muted uppercase tracking-widest">
              obsessed.cba • Selección Córdoba
            </span>
          </div>

          {/* Grid de Productos Responsivo (1 col móvil, 2 col tablet/desktop pequeño, 3 col desktop) */}
          {filteredProducts.length === 0 ? (
            <div className="border border-dashed border-brand-border bg-brand-surface py-20 px-6 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-neutral-200 flex items-center justify-center text-brand-muted">
                <Search size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold font-mono uppercase tracking-widest text-brand-black">
                  Sin Resultados
                </h4>
                <p className="text-xs font-mono text-brand-muted max-w-sm mx-auto leading-relaxed">
                  No encontramos productos que coincidan con la combinación de filtros seleccionada.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-brand-black text-brand-white text-xs font-mono uppercase tracking-widest hover:bg-neutral-900 transition-all shadow-xs"
              >
                Restablecer todos los filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL / DRAWER DE FILTROS EN DISPOSITIVOS MÓVILES                         */}
      {/* ========================================================================= */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Overlay oscuro */}
          <div
            onClick={() => setIsMobileFiltersOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
          />

          {/* Panel Lateral Drawer */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm h-full bg-brand-white shadow-2xl flex flex-col z-10 animate-slideLeft">
            {/* Header del Drawer */}
            <div className="flex items-center justify-between p-4 border-b border-brand-border bg-brand-surface">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={15} />
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-brand-black">
                  Filtros y Desplegables
                </h3>
              </div>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1 text-brand-muted hover:text-brand-black transition-colors"
                aria-label="Cerrar panel de filtros"
              >
                <X size={18} />
              </button>
            </div>

            {/* Contenido scrolleable de filtros */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {renderFilterSections()}
            </div>

            {/* Footer del Drawer */}
            <div className="p-4 border-t border-brand-border bg-brand-surface flex items-center gap-2">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-3 border border-brand-border bg-brand-white text-brand-black text-xs font-mono uppercase tracking-widest hover:border-brand-black transition-all"
              >
                Restablecer
              </button>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="flex-1 py-3 bg-brand-black text-brand-white text-xs font-mono uppercase tracking-widest hover:bg-neutral-900 transition-all shadow-xs"
              >
                Ver ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
