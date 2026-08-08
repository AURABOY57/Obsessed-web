"use client";

import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import Image from "next/image";
import { Plus, Trash2, ArrowLeft, ArrowRight, Video, Image as ImageIcon, Play, Upload } from "lucide-react";

import { isVideoUrl } from "@/lib/media-utils";
export { isVideoUrl };

interface MultiMediaUploadProps {
  mediaList: string[];
  onChange: (newList: string[]) => void;
  disabled?: boolean;
  maxItems?: number;
  presetName?: string;
  cloudName?: string;
}

export function MultiMediaUpload({
  mediaList,
  onChange,
  disabled = false,
  maxItems = 5,
  presetName = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "obsessed_preset",
  cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "obsessed-cba",
}: MultiMediaUploadProps) {
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFileToCloudinary = async (file: File): Promise<string> => {
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    if (!isImage && !isVideo) {
      throw new Error("Formato no soportado. Selecciona una imagen (JPG, PNG, WebP) o video (MP4, WebM, MOV).");
    }

    // Si no hay Cloudinary configurado, fallback con URL temporal de objeto
    if (!presetName || !cloudName || cloudName === "obsessed-cba") {
      return URL.createObjectURL(file);
    }

    const endpoint = isVideo
      ? `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
      : `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", presetName);
    formData.append("folder", "obsessed_products");

    const res = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("No se pudo subir a Cloudinary. Se usará vista local.");
    }

    const data = await res.json();
    return data.secure_url;
  };

  const handleFilesSelected = async (files: FileList | File[]) => {
    try {
      setIsUploading(true);
      setErrorMessage(null);

      const fileArray = Array.from(files);
      const remainingSlots = maxItems - (activeSlotIndex !== null ? mediaList.length - 1 : mediaList.length);

      if (fileArray.length > remainingSlots && activeSlotIndex === null) {
        setErrorMessage(`Solo puedes agregar hasta un máximo de ${maxItems} fotos/videos.`);
      }

      const filesToProcess = activeSlotIndex !== null ? [fileArray[0]] : fileArray.slice(0, remainingSlots);

      const uploadedUrls: string[] = [];
      for (const file of filesToProcess) {
        try {
          const url = await uploadFileToCloudinary(file);
          uploadedUrls.push(url);
        } catch (e: any) {
          console.warn("Fallo subida individual, usando URL local:", e);
          uploadedUrls.push(URL.createObjectURL(file));
        }
      }

      if (activeSlotIndex !== null) {
        // Reemplazar slot específico
        const updated = [...mediaList];
        if (uploadedUrls[0]) {
          updated[activeSlotIndex] = uploadedUrls[0];
          onChange(updated);
        }
        setActiveSlotIndex(null);
      } else {
        // Agregar al final
        const combined = [...mediaList, ...uploadedUrls].slice(0, maxItems);
        onChange(combined);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Error procesando archivos multimedia.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesSelected(e.target.files);
    }
  };

  const handleAddFromUrl = () => {
    if (!manualUrl.trim()) return;
    if (mediaList.length >= maxItems) {
      setErrorMessage(`Límite máximo de ${maxItems} elementos alcanzado.`);
      return;
    }
    onChange([...mediaList, manualUrl.trim()]);
    setManualUrl("");
    setShowUrlInput(false);
  };

  const handleRemoveItem = (index: number) => {
    const updated = mediaList.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleMoveItem = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= mediaList.length) return;

    const updated = [...mediaList];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  const triggerUploadForSlot = (index?: number) => {
    if (disabled || isUploading) return;
    setActiveSlotIndex(index !== undefined ? index : null);
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4 border border-brand-border p-4 bg-brand-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-border pb-3">
        <div>
          <span className="text-xs uppercase tracking-widest font-mono font-bold text-brand-black flex items-center gap-2">
            <span>Fotos & Videos del Producto</span>
            <span className="text-[10px] bg-neutral-200 text-neutral-800 px-2 py-0.5 font-normal">
              {mediaList.length} / {maxItems}
            </span>
          </span>
          <p className="text-[11px] font-mono text-brand-muted mt-0.5">
            <b>1ª Foto:</b> Portada principal • <b>Última Foto:</b> Hover al pasar el cursor • <b>Videos:</b> Se reproducen en la galería.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 border border-brand-border hover:border-brand-black transition-colors"
          >
            {showUrlInput ? "Ocultar URL" : "+ Pegar URL"}
          </button>
          <button
            type="button"
            onClick={() => triggerUploadForSlot()}
            disabled={disabled || isUploading || mediaList.length >= maxItems}
            className="text-xs font-mono uppercase tracking-wider px-3 py-1.5 bg-brand-black text-brand-white hover:bg-neutral-900 transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Upload size={13} />
            <span>Subir ({maxItems - mediaList.length} disp.)</span>
          </button>
        </div>
      </div>

      {/* Input oculto para subir archivos (Fotos y Videos) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple={activeSlotIndex === null}
        className="hidden"
        onChange={handleInputChange}
        disabled={disabled || isUploading}
      />

      {/* Campo opcional para ingresar URL manual (Cloudinary, MP4, etc.) */}
      {showUrlInput && (
        <div className="flex items-center gap-2 p-3 bg-brand-surface border border-brand-border animate-fadeIn">
          <input
            type="url"
            placeholder="Pega enlace de foto o video (ej: https://.../mate.mp4)"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            className="flex-1 h-8 border border-brand-border bg-brand-white px-2 text-xs font-mono"
          />
          <button
            type="button"
            onClick={handleAddFromUrl}
            className="h-8 px-3 bg-brand-black text-brand-white text-xs font-mono uppercase tracking-wider hover:bg-neutral-900"
          >
            Agregar
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-2.5 bg-red-50 border border-red-400 text-red-700 text-xs font-mono">
          {errorMessage}
        </div>
      )}

      {/* Grid de los 5 Slots Multimedia */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {Array.from({ length: maxItems }).map((_, index) => {
          const mediaUrl = mediaList[index];
          const isSlotFilled = Boolean(mediaUrl);
          const isCover = index === 0;
          const isHover = mediaList.length > 1 && index === mediaList.length - 1;
          const isVideo = isSlotFilled && isVideoUrl(mediaUrl);

          return (
            <div
              key={index}
              className={`relative aspect-[4/5] border flex flex-col justify-between p-1.5 transition-all ${
                isSlotFilled
                  ? "border-brand-border bg-brand-surface"
                  : "border-dashed border-neutral-300 bg-neutral-50/60 hover:border-brand-black"
              }`}
            >
              {/* Encabezado del Slot con Badge de Rol */}
              <div className="flex items-center justify-between z-10">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 bg-brand-black text-brand-white">
                  #{index + 1}
                </span>

                {isCover && isSlotFilled && (
                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider px-1 py-0.5 bg-neutral-900 text-amber-300">
                    PORTADA
                  </span>
                )}

                {isHover && isSlotFilled && !isCover && (
                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider px-1 py-0.5 bg-blue-700 text-white">
                    HOVER
                  </span>
                )}

                {isVideo && (
                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider px-1 py-0.5 bg-red-600 text-white flex items-center gap-0.5">
                    <Video size={9} />
                    <span>VIDEO</span>
                  </span>
                )}
              </div>

              {/* Vista Previa de Imagen o Video */}
              {isSlotFilled ? (
                <div className="relative flex-1 my-1 overflow-hidden bg-black/5 flex items-center justify-center">
                  {isVideo ? (
                    <div className="relative w-full h-full flex items-center justify-center bg-neutral-900 text-white">
                      <video
                        src={mediaUrl}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                        onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                        onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20">
                        <Play size={20} className="text-white drop-shadow-md opacity-80" />
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={mediaUrl}
                      alt={`Foto ${index + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => triggerUploadForSlot()}
                  disabled={disabled || isUploading}
                  className="flex-1 flex flex-col items-center justify-center text-center p-2 cursor-pointer text-neutral-400 hover:text-brand-black transition-colors"
                >
                  <Plus size={20} className="mb-1" />
                  <span className="text-[9px] font-mono uppercase tracking-wider">
                    {index === 0 ? "Foto Portada" : index === 4 ? "Foto Hover" : "Agregar"}
                  </span>
                </button>
              )}

              {/* Barra de Acciones del Slot (Reordenar / Cambiar / Eliminar) */}
              {isSlotFilled && (
                <div className="flex items-center justify-between pt-1 border-t border-brand-border/60 z-10 bg-brand-surface/90">
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveItem(index, "left")}
                      title="Mover a la izquierda"
                      className="p-1 text-neutral-600 hover:text-brand-black disabled:opacity-20 transition-colors"
                    >
                      <ArrowLeft size={11} />
                    </button>
                    <button
                      type="button"
                      disabled={index === mediaList.length - 1}
                      onClick={() => handleMoveItem(index, "right")}
                      title="Mover a la derecha"
                      className="p-1 text-neutral-600 hover:text-brand-black disabled:opacity-20 transition-colors"
                    >
                      <ArrowRight size={11} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => triggerUploadForSlot(index)}
                      className="text-[9px] font-mono uppercase text-brand-muted hover:text-brand-black px-1 py-0.5"
                      title="Reemplazar archivo"
                    >
                      Cambiar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="p-1 text-neutral-500 hover:text-red-600 transition-colors"
                      title="Eliminar este medio"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isUploading && (
        <div className="flex items-center justify-center gap-2 p-2 bg-neutral-100 text-xs font-mono text-brand-black">
          <span className="w-3.5 h-3.5 border-2 border-brand-black border-t-transparent rounded-full animate-spin" />
          <span>Subiendo archivo multimedia...</span>
        </div>
      )}
    </div>
  );
}
