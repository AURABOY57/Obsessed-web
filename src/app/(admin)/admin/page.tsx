import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { QuickProductRow } from "@/components/admin/QuickProductRow";
import { SalesChart, SalesDataPoint } from "@/components/admin/SalesChart";
import { StockAlerts } from "@/components/admin/StockAlerts";
import { formatPrice } from "@/lib/utils";
import {
  DollarSign,
  TrendingUp,
  Package,
  ShoppingBag,
  Clock,
  Truck,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  imageUrl: string;
  isActive: boolean;
  category?: string | null;
  subCategory?: string | null;
}

interface AdminOrderSummary {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  status: string;
  total: number;
  createdAt: Date;
  itemsCount: number;
}

const DEMO_PRODUCTS: AdminProduct[] = [
  {
    id: "demo-1",
    name: "Mate Imperial Premium Noir",
    slug: "mate-imperial-premium-noir",
    price: 48000,
    stock: 8,
    imageUrl: "/images/products/mate-imperial-noir.png",
    isActive: true,
    category: "Mates",
    subCategory: "Imperial",
  },
  {
    id: "demo-2",
    name: "Mate Torpedo Cuero Seleccionado",
    slug: "mate-torpedo-cuero-seleccionado",
    price: 42000,
    stock: 6,
    imageUrl: "/images/products/mate-torpedo-cuero.png",
    isActive: true,
    category: "Mates",
    subCategory: "Torpedo",
  },
  {
    id: "demo-3",
    name: "Termo Obsidian Matte 1L",
    slug: "termo-obsidian-matte-1l",
    price: 68000,
    stock: 10,
    imageUrl: "/images/products/termo-obsidian-black.png",
    isActive: true,
    category: "Termos",
    subCategory: "Acero Inox",
  },
  {
    id: "demo-4",
    name: "Bombilla Pico de Loro Alpaca Cincelada",
    slug: "bombilla-pico-de-loro-alpaca-cincelada",
    price: 18500,
    stock: 15,
    imageUrl: "/images/products/bombilla-alpaca-pico.png",
    isActive: true,
    category: "Bombillas",
    subCategory: "Alpaca Maciza",
  },
];

export default async function AdminDashboardPage() {
  let allProducts: AdminProduct[] = DEMO_PRODUCTS;
  let allOrders: AdminOrderSummary[] = [];

  try {
    const [productsData, ordersData] = await Promise.all([
      prisma.product.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
    ]);

    if (productsData.length > 0) {
      allProducts = productsData.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        stock: p.stock,
        imageUrl: p.imageUrl,
        isActive: p.isActive,
        category: p.category,
        subCategory: p.subCategory,
      }));
    }

    if (ordersData && ordersData.length > 0) {
      allOrders = ordersData.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        customerPhone: o.customerPhone,
        status: o.status,
        total: Number(o.total),
        createdAt: o.createdAt,
        itemsCount: o.items.length,
      }));
    }
  } catch (error) {
    console.warn("[ADMIN_DASHBOARD_DB_FALLBACK]:", error);
  }

  // Métricas Clave (KPIs Reales de Producción)
  const totalSales = allOrders.reduce((acc, o) => acc + o.total, 0);
  const monthSales = allOrders
    .filter((o) => {
      const orderDate = new Date(o.createdAt);
      const now = new Date();
      return (
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((acc, o) => acc + o.total, 0);

  // Ganancias estimadas (margen de contribución real promedio de ~38%)
  const estimatedProfit = totalSales > 0 ? Math.round(totalSales * 0.38) : 0;

  // Alertas de Pedidos y Stock
  const pendingOrders = allOrders.filter(
    (o) => o.status === "PENDING" || o.status === "CONFIRMED"
  );
  const lowStockProducts = allProducts.filter((p) => p.stock < 2);

  const totalProductsCount = allProducts.length;
  const activeProductsCount = allProducts.filter((p) => p.isActive).length;

  const MONTH_NAMES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  // Generar datos reales para gráfico de últimos 7 días
  const data7Days: SalesDataPoint[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
    const dayOrders = allOrders.filter((o) => {
      const od = new Date(o.createdAt);
      return (
        od.getDate() === d.getDate() &&
        od.getMonth() === d.getMonth() &&
        od.getFullYear() === d.getFullYear()
      );
    });
    const amount = dayOrders.reduce((sum, o) => sum + o.total, 0);
    return {
      date: dayStr,
      label: `${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`,
      amount,
      orders: dayOrders.length,
    };
  });

  // Generar datos reales para gráfico de 30 días
  const data30Days: SalesDataPoint[] = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dayStr = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
    const dayOrders = allOrders.filter((o) => {
      const od = new Date(o.createdAt);
      return (
        od.getDate() === d.getDate() &&
        od.getMonth() === d.getMonth() &&
        od.getFullYear() === d.getFullYear()
      );
    });
    const amount = dayOrders.reduce((sum, o) => sum + o.total, 0);
    return {
      date: dayStr,
      label: `${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`,
      amount,
      orders: dayOrders.length,
    };
  });

  return (
    <div className="space-y-8">
      {/* Encabezado Principal */}
      <div className="border-b border-brand-border pb-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <h1 className="text-xl font-bold uppercase tracking-widest font-mono text-brand-black">
            Panel de Resumen
          </h1>
        </div>
        <p className="text-xs font-mono text-brand-muted mt-1">
          Radiografía en tiempo real de ventas, stock y pedidos de <strong>obsessed.cba</strong>
        </p>
      </div>

      {/* Alertas Urgentes de Stock Bajo (< 2) */}
      <StockAlerts
        products={allProducts.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          stock: p.stock,
          price: p.price,
          category: p.category,
          imageUrl: p.imageUrl,
        }))}
      />

      {/* Métricas Clave (KPIs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Ventas del Mes */}
        <div className="border border-brand-border bg-brand-white p-4 space-y-1.5">
          <div className="flex items-center justify-between text-brand-muted">
            <span className="text-[11px] font-mono uppercase tracking-wider">Ventas del Mes</span>
            <DollarSign size={16} className="text-brand-black" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-brand-black">
            {formatPrice(monthSales)}
          </p>
          <p className="text-[10px] font-mono text-brand-muted">
            Total acumulado: {formatPrice(totalSales)}
          </p>
        </div>

        {/* KPI 2: Pedidos Nuevos & Activos */}
        <div className="border border-brand-border bg-brand-white p-4 space-y-1.5">
          <div className="flex items-center justify-between text-brand-muted">
            <span className="text-[11px] font-mono uppercase tracking-wider">Pedidos Nuevos</span>
            <Clock size={16} className={pendingOrders.length > 0 ? "text-amber-600" : "text-brand-black"} />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-brand-black">
            {pendingOrders.length}
          </p>
          <p className="text-[10px] font-mono text-amber-700">
            {pendingOrders.length} {pendingOrders.length === 1 ? "pendiente de despacho" : "pendientes de despacho"}
          </p>
        </div>

        {/* KPI 3: Ganancias Estimadas */}
        <div className="border border-brand-border bg-brand-white p-4 space-y-1.5">
          <div className="flex items-center justify-between text-brand-muted">
            <span className="text-[11px] font-mono uppercase tracking-wider">Ganancia Estimada</span>
            <TrendingUp size={16} className="text-green-700" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-green-700">
            {formatPrice(estimatedProfit)}
          </p>
          <p className="text-[10px] font-mono text-brand-muted">
            Margen de utilidad ~38%
          </p>
        </div>

        {/* KPI 4: Catálogo e Inventario */}
        <div className="border border-brand-border bg-brand-white p-4 space-y-1.5">
          <div className="flex items-center justify-between text-brand-muted">
            <span className="text-[11px] font-mono uppercase tracking-wider">Catálogo Activo</span>
            <Package size={16} className="text-brand-black" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-brand-black">
            {activeProductsCount} <span className="text-xs text-brand-muted font-normal">/ {totalProductsCount}</span>
          </p>
          <p className="text-[10px] font-mono text-brand-muted">
            {lowStockProducts.length > 0 ? (
              <span className="text-amber-700 font-bold">{lowStockProducts.length} con stock &lt; 2</span>
            ) : (
              "Stock óptimo en tienda"
            )}
          </p>
        </div>
      </div>

      {/* Gráfico Dinámico de Curva de Ventas */}
      <SalesChart data7Days={data7Days} data30Days={data30Days} />

      {/* Dos Columnas: Pedidos Pendientes de Envío & Ajuste Rápido de Productos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna Izquierda: Pedidos Pendientes de Envío / Preparación */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase font-mono tracking-widest text-brand-black font-bold flex items-center gap-2">
              <Truck size={14} />
              <span>Pedidos por Preparar / Enviar</span>
            </h3>
            <Link
              href="/admin/pedidos"
              className="text-xs font-mono text-brand-muted hover:text-brand-black uppercase tracking-wider underline"
            >
              Ver todos ({allOrders.length}) →
            </Link>
          </div>

          <div className="space-y-2.5">
            {allOrders.length === 0 ? (
              <div className="border border-dashed border-brand-border p-8 text-center text-xs font-mono text-brand-muted bg-brand-white">
                No hay pedidos pendientes por despachar.
              </div>
            ) : (
              allOrders.slice(0, 3).map((order) => {
                const isPending = order.status === "PENDING";
                const isConfirmed = order.status === "CONFIRMED";
                const isShipped = order.status === "SHIPPED";

                return (
                  <div
                    key={order.id}
                    className="border border-brand-border bg-brand-white p-3.5 flex items-center justify-between gap-3 hover:border-brand-black transition-colors"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-brand-black">
                          #{order.orderNumber}
                        </span>
                        <span
                          className={`text-[9px] font-mono uppercase px-1.5 py-0.2 border font-semibold ${
                            isPending
                              ? "bg-amber-100 text-amber-800 border-amber-300"
                              : isConfirmed
                              ? "bg-blue-100 text-blue-800 border-blue-300"
                              : isShipped
                              ? "bg-purple-100 text-purple-800 border-purple-300"
                              : "bg-green-100 text-green-800 border-green-300"
                          }`}
                        >
                          {isPending
                            ? "Pendiente Pago"
                            : isConfirmed
                            ? "Preparando"
                            : isShipped
                            ? "Enviado"
                            : "Entregado"}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-brand-muted truncate">
                        {order.customerName} • {order.customerPhone}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs font-mono font-bold text-brand-black">
                        {formatPrice(order.total)}
                      </p>
                      <Link
                        href="/admin/pedidos"
                        className="text-[10px] font-mono uppercase tracking-wider text-brand-muted hover:text-brand-black underline block mt-0.5"
                      >
                        Gestionar
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Columna Derecha: Catálogo Reciente & Ajuste Rápido */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase font-mono tracking-widest text-brand-black font-bold flex items-center gap-2">
              <Package size={14} />
              <span>Ajuste Rápido de Stock</span>
            </h3>
            <Link
              href="/admin/productos"
              className="text-xs font-mono text-brand-muted hover:text-brand-black uppercase tracking-wider underline"
            >
              Inventario ({allProducts.length}) →
            </Link>
          </div>

          <div className="space-y-2">
            {allProducts.slice(0, 3).map((product) => (
              <QuickProductRow key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
