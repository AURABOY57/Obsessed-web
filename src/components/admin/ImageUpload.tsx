"use client";

import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import Image from "next/image";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  label?: string;
  presetName?: string;
  cloudName?: string;
}

export function ImageUpload({
  value,
  onChange,
  disabled = false,
  label = "Fotografía del Producto",
  presetName = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "obsessed_preset",
  cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "obsessed-cba",
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToCloudinary = async (file: File) => {
    try {
      setIsUploading(true);
      setErrorMessage(null);

      // Si aún no están configuradas las variables, usar fallback local
      if (!presetName || !cloudName) {
        const localUrl = URL.createObjectURL(file);
        setPreview(localUrl);
        onChange(localUrl);
        setIsUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", presetName);
      formData.append("folder", "obsessed_products");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Fallo al subir imagen a Cloudinary. Verifica las credenciales.");
      }

      const data = await response.json();
      setPreview(data.secure_url);
      onChange(data.secure_url);
    } catch (err: unknown) {
      console.error("[ImageUpload Error]:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Error al procesar la imagen."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Por favor selecciona un archivo de imagen (JPG, PNG, WebP).");
      return;
    }
    uploadToCloudinary(file);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled || isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <span className="text-xs uppercase tracking-widest font-mono text-brand-black">
        {label}
      </span>

      {/* accept="image/*" abre la cámara de inmediato en dispositivos móviles */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
        disabled={disabled || isUploading}
      />

      <div
        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Subir fotografía"
        className={`relative w-full aspect-square sm:aspect-[4/3] flex flex-col items-center justify-center p-4 border transition-all duration-200 cursor-pointer select-none bg-brand-white
          ${
            isDragging
              ? "border-brand-black bg-brand-surface scale-[0.99]"
              : "border-brand-border hover:border-brand-black"
          }
          ${disabled || isUploading ? "opacity-60 cursor-not-allowed" : ""}
        `}
      >
        {preview ? (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <Image
              src={preview}
              alt="Vista previa"
              fill
              unoptimized
              className="object-contain p-2"
            />
            <div className="absolute inset-0 bg-brand-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
              <button
                type="button"
                onClick={handleRemove}
                className="bg-brand-white text-brand-black text-xs font-mono uppercase tracking-widest px-4 py-2 hover:bg-brand-black hover:text-brand-white border border-brand-black transition-colors"
              >
                Eliminar
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="bg-brand-black text-brand-white text-xs font-mono uppercase tracking-widest px-4 py-2 hover:bg-brand-white hover:text-brand-black border border-brand-black transition-colors"
              >
                Cambiar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center space-y-3 pointer-events-none">
            <div className="w-12 h-12 border border-brand-black flex items-center justify-center text-brand-black">
              {isUploading ? (
                <span className="w-4 h-4 border-2 border-brand-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-brand-black font-semibold">
                {isUploading ? "Subiendo foto..." : "Toca para foto o arrastra"}
              </p>
              <p className="text-[11px] text-brand-muted font-mono">
                Móvil: abre cámara | PC: arrastra archivo
              </p>
            </div>
          </div>
        )}
      </div>

      {errorMessage && (
        <p className="text-xs font-mono text-red-600 mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
