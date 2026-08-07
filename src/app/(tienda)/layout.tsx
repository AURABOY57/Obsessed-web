import React from "react";
import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { FloatingWhatsAppButton } from "@/components/shop/FloatingWhatsAppButton";

export default function TiendaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-brand-white text-brand-black relative">
      <Navbar />
      <CartDrawer />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
}
