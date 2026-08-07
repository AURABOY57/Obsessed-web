"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createProductAction, updateProductAction } from "@/actions/product-actions";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProductFormProps {
  initialData?: {
    id: string;
    name: string;
    description: string | null;
    category: string | null;
    price: number | string;
    stock: number;
    imageUrl: string;
    isActive: boolean;
  };
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData);

  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "Indumentaria");
  const [price, setPrice] = useState(initialData?.price ? String(initialData.price) : "");
  const [stock, setStock] = useState(initialData?.stock !== undefined ? String(initialData.stock) : "1");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);

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
      price: Number(price),
      stock: Number(stock),
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

      {/* Campos de Texto */}
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

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Precio (ARS) *"
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
            label="Stock Disponible *"
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

        <Input
          label="Categoría"
          placeholder="Ej: Mates, Bombillas, Termos, Accesorios"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={isLoading}
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-mono uppercase tracking-widest text-brand-black">
            Descripción / Detalles
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
