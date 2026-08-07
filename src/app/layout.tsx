import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "obsessed.cba | Mates de Autor, Bombillas, Termos & Accesorios",
  description: "Plataforma de mates de autor, bombillas de alpaca, termos térmicos y accesorios en Córdoba, Argentina. Estética pura, geométrica y monocromática.",
  keywords: ["obsessed.cba", "mate", "mates", "bombillas", "termos", "materas", "cordoba", "mate imperial", "torpedo", "argentina"],
  openGraph: {
    title: "obsessed.cba | Mates de Autor & Accesorios",
    description: "El ritual del mate elevado al diseño y la pureza geométrica.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-brand-white text-brand-black min-h-screen selection:bg-brand-black selection:text-brand-white" suppressHydrationWarning>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
