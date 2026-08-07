"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdminAction } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("password", password);

    const response = await loginAdminAction(null, formData);

    if (response.success) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(response.message || "Error al iniciar sesión.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm border border-brand-border bg-brand-white p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border border-brand-black mx-auto flex items-center justify-center text-brand-black">
            <Lock size={16} />
          </div>
          <h1 className="text-sm uppercase font-mono tracking-widest font-bold text-brand-black">
            obsessed.cba
          </h1>
          <p className="text-[11px] font-mono text-brand-muted">
            Acceso al Panel de Control
          </p>
        </div>

        {error && (
          <div className="p-2.5 border border-red-500 bg-red-50 text-red-700 text-xs font-mono text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            label="Contraseña de Administrador"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
          />

          <Button type="submit" isLoading={isLoading} className="w-full">
            Ingresar al Panel
          </Button>
        </form>

        <div className="text-center">
          <a
            href="/"
            className="text-[10px] font-mono text-brand-muted hover:text-brand-black uppercase tracking-wider underline"
          >
            ← Volver a la Tienda Pública
          </a>
        </div>
      </div>
    </div>
  );
}
