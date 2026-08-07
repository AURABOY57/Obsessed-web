"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createProductAction, updateProductAction } from "@/actions/product-actions";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Sparkles, Layers } from "lucide-react";

export interface ProductVariantItem {
  name: string; // ej: "Tipo de Virola", "Color", "Material"
  options: string[]; // ej: ["Lisa", "Cincelada"]
}

interface ProductFormProps {
  initialData?: {
    id: string;
    name: string;
    description: string | null;
    category: string | null;
    subCategory?: string | null;
    price: number | string;
    costPrice?: number | string | null;
    stock: number;
    variants?: any;
    imageUrl: string;
    isActive: boolean;
  };
}

const CATEGORY_SUGGESTIONS: Record<string, string[]> = {
  Mates: ["Imperial", "Torpedo", "Camionero", "Calabaza", "Madera", "Acero", "Cerámica"],
  Bombillas: ["Alpaca Cincelada", "Alpaca Lisa", "Pico de Loro", "Acero Inoxidable", "Resorte"],
  Yerbas: ["Con Palo", "Despalada", "Compuesta", "Barbacuá", "Orgánica"],
  Termos: ["Acero Inox 1L", "Pico Cebador", "Media Manija", "Obsidian Matte"],
  Accesorios: ["Matera de Cuero", "Cuchillo Criollo", "Porta Termo", "Limpiador"],
};

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData);

  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "Mates");
  const [subCategory, setSubCategory] = useState(initialData?.subCategory || "");
  const [price, setPrice] = useState(initialData?.price ? String(initialData.price) : "");
  const [costPrice, setCostPrice] = useState(initialData?.costPrice ? String(initialData.costPrice) : "");
  const [stock, setStock] = useState(initialData?.stock !== undefined ? String(initialData.stock) : "5");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  // Variantes
  const [variants, setVariants] = useState<ProductVariantItem[]>(() => {
    if (initialData?.variants && Array.isArray(initialData.variants)) {
      return initialData.variants;
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);

  // Manejo de Variantes
  const handleAddVariantGroup = () => {
    setVariants((prev) => [...prev, { name: "Tipo de Virola", options: ["Lisa", "Cincelada"] }]);
  };

  const handleRemoveVariantGroup = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateVariantName = (index: number, newName: string) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, name: newName } : v))
    );
  };

  const handleUpdateVariantOptions = (index: number, optionsString: string) => {
    const splitOptions = optionsString
      .split(",")
      .map((opt) => opt.trim())
      .filter((opt) => opt.length > 0);

    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, options: splitOptions } : v))
    );
  };

  const handleQuickVariantTemplate = (type: "virola" | "color" | "material") => {
    if (type === "virola") {
      setVariants((prev) => [...prev, { name: "Virola", options: ["Lisa", "Cincelada"] }]);
    } else if (type === "color") {
      setVariants((prev) => [...prev, { name: "Color", options: ["Negro", "Marrón", "Suela"] }]);
    } else if (type === "material") {
      setVariants((prev) => [...prev, { name: "Material", options: ["Calabaza", "Alpaca Maciza"] }]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setFieldErrors(null);

    if (!imageUrl) {
      setErrorMessage("Por favor selecciona o sube una fotografía del producto.");
      setIsLoading(false);
      return;
    }

    const payload = {
      name,
      description,
      category,
      subCategory,
      price: Number(price),
      costPrice: costPrice ? Number(costPrice) : null,
      stock: Number(stock),
      variants: variants.filter((v) => v.name.trim() && v.options.length > 0),
      imageUrl,
      images: [imageUrl],
      isActive,
    };

    const response = isEditing && initialData
      ? await updateProductAction(initialData.id, payload)
      : await createProductAction(payload);

    if (!response.success) {
      setErrorMessage(response.message || "Error al procesar el formulario.");
      if (response.fieldErrors) setFieldErrors(response.fieldErrors);
      setIsLoading(false);
    } else {
      router.push("/admin/productos");
      router.refresh();
    }
  };

  const availableSubcategories = CATEGORY_SUGGESTIONS[category] || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {errorMessage && (
        <div className="p-3 border border-red-500 bg-red-50 text-red-700 text-xs font-mono">
          {errorMessage}
        </div>
      )}

      {/* Subida de Imagen */}
      <ImageUpload
        value={imageUrl}
        onChange={(url) => setImageUrl(url)}
        disabled={isLoading}
        label="Fotografía Principal *"
      />
      {fieldErrors?.imageUrl && (
        <p className="text-xs font-mono text-red-600">{fieldErrors.imageUrl[0]}</p>
      )}

      {/* Campos de Información General */}
      <div className="grid grid-cols-1 gap-4">
        <Input
          label="Nombre del Producto *"
          placeholder="Ej: Mate Imperial Premium Noir"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fieldErrors?.name?.[0]}
          required
          disabled={isLoading}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Precio de Venta (ARS) *"
            type="number"
            min="0"
            step="1"
            placeholder="Ej: 48000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            error={fieldErrors?.price?.[0]}
            required
            disabled={isLoading}
          />

          <Input
            label="Costo Estimado (Opcional)"
            type="number"
            min="0"
            placeholder="Ej: 28000"
            value={costPrice}
            onChange={(e) => setCostPrice(e.target.value)}
            disabled={isLoading}
          />

          <Input
            label="Stock Inicial *"
            type="number"
            min="0"
            placeholder="Ej: 10"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            error={fieldErrors?.stock?.[0]}
            required
            disabled={isLoading}
          />
        </div>

        {/* Categorización Clara */}
        <div className="space-y-2 border border-brand-border p-4 bg-brand-surface/40">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-widest text-brand-black font-semibold">
                Categoría Principal *
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubCategory("");
                }}
                disabled={isLoading}
                className="w-full h-10 border border-brand-border bg-brand-white px-3 text-xs font-mono text-brand-black focus:border-brand-black focus:outline-none"
              >
                <option value="Mates">Mates</option>
                <option value="Bombillas">Bombillas</option>
                <option value="Yerbas">Yerbas</option>
                <option value="Termos">Termos</option>
                <option value="Accesorios">Accesorios</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-widest text-brand-black font-semibold">
                Subcategoría / Tipo
              </label>
              <input
                type="text"
                list="subcategories-list"
                placeholder="Ej: Calabaza, Madera, Imperial..."
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                disabled={isLoading}
                className="w-full h-10 border border-brand-border bg-brand-white px-3 text-xs font-mono text-brand-black focus:border-brand-black focus:outline-none"
              />
              <datalist id="subcategories-list">
                {availableSubcategories.map((sub) => (
                  <option key={sub} value={sub} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Sugerencias Rápidas de Subcategoría */}
          {availableSubcategories.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-mono text-brand-muted uppercase">Sugeridos:</span>
              {availableSubcategories.map((sub) => (
                <button
                  type="button"
                  key={sub}
                  onClick={() => setSubCategory(sub)}
                  className={`text-[10px] font-mono px-2 py-0.5 border transition-colors ${
                    subCategory === sub
                      ? "bg-brand-black text-brand-white border-brand-black"
                      : "bg-brand-white text-brand-muted hover:text-brand-black border-brand-border"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sección de Variantes (Virola Lisa/Cincelada, Colores, etc.) */}
        <div className="space-y-3 border border-brand-border p-4 bg-brand-white">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-brand-black flex items-center gap-1.5">
                <Layers size={14} />
                <span>Variantes del Producto</span>
              </h4>
              <p className="text-[11px] font-mono text-brand-muted">
                Opciones seleccionables por el cliente (ej. Virola Lisa o Cincelada, Colores de cuero).
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddVariantGroup}
              className="text-xs font-mono uppercase tracking-wider px-2.5 py-1 border border-brand-black hover:bg-brand-black hover:text-brand-white transition-colors flex items-center gap-1"
            >
              <Plus size={12} />
              <span>+ Variante</span>
            </button>
          </div>

          {/* Plantillas Rápidas */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-brand-muted uppercase">Plantillas rápidas:</span>
            <button
              type="button"
              onClick={() => handleQuickVariantTemplate("virola")}
              className="text-[10px] font-mono px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 border border-brand-border uppercase"
            >
              + Virola (Lisa / Cincelada)
            </button>
            <button
              type="button"
              onClick={() => handleQuickVariantTemplate("color")}
              className="text-[10px] font-mono px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 border border-brand-border uppercase"
            >
              + Colores de Cuero
            </button>
          </div>

          {/* Listado de Variantes Definidas */}
          {variants.length === 0 ? (
            <p className="text-[11px] font-mono text-brand-muted italic py-1">
              Sin variantes. El producto se venderá como modelo único estándar.
            </p>
          ) : (
            <div className="space-y-3 pt-2">
              {variants.map((v, idx) => (
                <div key={idx} className="border border-brand-border p-3 bg-brand-surface/40 flex items-start gap-3">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-brand-muted">
                        Tipo de Variante:
                      </label>
                      <input
                        type="text"
                        value={v.name}
                        onChange={(e) => handleUpdateVariantName(idx, e.target.value)}
                        placeholder="Ej: Tipo de Virola"
                        className="w-full h-8 border border-brand-border bg-brand-white px-2 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-brand-muted">
                        Opciones (separadas por coma):
                      </label>
                      <input
                        type="text"
                        value={v.options.join(", ")}
                        onChange={(e) => handleUpdateVariantOptions(idx, e.target.value)}
                        placeholder="Ej: Lisa, Cincelada"
                        className="w-full h-8 border border-brand-border bg-brand-white px-2 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveVariantGroup(idx)}
                    className="p-1.5 text-brand-muted hover:text-red-600 transition-colors mt-4"
                    title="Eliminar variante"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Descripción */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono uppercase tracking-widest text-brand-black">
            Descripción / Detalles del Producto
          </label>
          <textarea
            rows={3}
            className="w-full border border-brand-border bg-brand-white p-3 text-sm text-brand-black placeholder:text-brand-muted/70 focus:border-brand-black focus:outline-none font-sans"
            placeholder="Material, corte, detalles de confección..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Visibilidad Activo / Inactivo */}
        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            disabled={isLoading}
            className="w-4 h-4 accent-black border-brand-border cursor-pointer"
          />
          <label htmlFor="isActive" className="text-xs font-mono uppercase tracking-wider text-brand-black cursor-pointer">
            Producto visible en la tienda pública
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-brand-border">
        <Button type="submit" isLoading={isLoading} className="flex-1 sm:flex-none">
          {isEditing ? "Guardar Cambios" : "Publicar Producto"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
