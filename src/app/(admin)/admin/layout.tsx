import React from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { isAuthenticatedAdmin } from "@/lib/auth";

export const metadata = {
  title: "Panel de Administración | obsessed.cba",
  description: "Gestión de catálogo, stock y pedidos para obsessed.cba",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = await isAuthenticatedAdmin();

  return (
    <div className="min-h-screen bg-brand-white text-brand-black flex flex-col font-sans selection:bg-brand-black selection:text-brand-white">
      {isAuth && <AdminNav />}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-20 md:pb-8">
        {children}
      </main>
    </div>
  );
}
