"use client";

import React, { useState, useMemo } from "react";
import { formatPrice } from "@/lib/utils";
import { TrendingUp, Calendar, ArrowUpRight } from "lucide-react";

export interface SalesDataPoint {
  date: string; // "DD/MM"
  label: string; // "7 Ago"
  amount: number;
  orders: number;
}

interface SalesChartProps {
  data7Days?: SalesDataPoint[];
  data30Days?: SalesDataPoint[];
}

// Datos demo inteligentes y realistas de ventas si aún no hay suficientes pedidos en BD
const DEFAULT_7_DAYS: SalesDataPoint[] = [
  { date: "01/08", label: "1 Ago", amount: 48000, orders: 1 },
  { date: "02/08", label: "2 Ago", amount: 96000, orders: 2 },
  { date: "03/08", label: "3 Ago", amount: 42000, orders: 1 },
  { date: "04/08", label: "4 Ago", amount: 134500, orders: 3 },
  { date: "05/08", label: "5 Ago", amount: 86500, orders: 2 },
  { date: "06/08", label: "6 Ago", amount: 162000, orders: 4 },
  { date: "07/08", label: "7 Ago (Hoy)", amount: 210000, orders: 5 },
];

const DEFAULT_30_DAYS: SalesDataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const base = 35000 + Math.sin(i / 3) * 25000 + (i * 3200);
  const amount = Math.max(15000, Math.round(base / 1000) * 1000);
  const orders = Math.max(1, Math.round(amount / 45000));
  return {
    date: `${day < 10 ? "0" + day : day}/07`,
    label: `${day} Jul`,
    amount,
    orders,
  };
});

export function SalesChart({ data7Days = DEFAULT_7_DAYS, data30Days = DEFAULT_30_DAYS }: SalesChartProps) {
  const [period, setPeriod] = useState<"7d" | "30d">("7d");
  const [hoveredPoint, setHoveredPoint] = useState<SalesDataPoint | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const currentData = period === "7d" ? data7Days : data30Days;

  const totalPeriodSales = useMemo(() => {
    return currentData.reduce((acc, curr) => acc + curr.amount, 0);
  }, [currentData]);

  const totalPeriodOrders = useMemo(() => {
    return currentData.reduce((acc, curr) => acc + curr.orders, 0);
  }, [currentData]);

  const maxAmount = useMemo(() => {
    const max = Math.max(...currentData.map((d) => d.amount), 10000);
    return Math.ceil(max * 1.15); // +15% margen superior
  }, [currentData]);

  // Dimensiones del SVG
  const width = 700;
  const height = 220;
  const paddingX = 35;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingTop - paddingBottom;

  const points = useMemo(() => {
    const step = chartWidth / (currentData.length - 1 || 1);
    return currentData.map((item, index) => {
      const x = paddingX + index * step;
      const y = height - paddingBottom - (item.amount / maxAmount) * chartHeight;
      return { x, y, item, index };
    });
  }, [currentData, chartWidth, chartHeight, height, maxAmount, paddingBottom, paddingX]);

  // Generar curva suave en SVG (Bezier Spline)
  const pathD = useMemo(() => {
    if (points.length === 0) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return d;
  }, [points]);

  const areaD = useMemo(() => {
    if (!pathD || points.length === 0) return "";
    const lastX = points[points.length - 1].x;
    const firstX = points[0].x;
    const bottomY = height - paddingBottom;
    return `${pathD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [pathD, points, height, paddingBottom]);

  return (
    <div className="border border-brand-border bg-brand-white p-5 space-y-4">
      {/* Header del Gráfico con Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest font-bold text-brand-black flex items-center gap-1.5">
              <TrendingUp size={14} className="text-brand-black" />
              Tendencia de Ventas
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-100 text-brand-black border border-brand-border uppercase font-semibold">
              ARS
            </span>
          </div>
          <p className="text-[11px] font-mono text-brand-muted mt-0.5">
            Total período: <strong className="text-brand-black">{formatPrice(totalPeriodSales)}</strong> ({totalPeriodOrders} pedidos)
          </p>
        </div>

        {/* Toggle 7D / 30D */}
        <div className="flex items-center border border-brand-black self-start sm:self-auto">
          <button
            onClick={() => {
              setPeriod("7d");
              setHoveredPoint(null);
              setHoveredIndex(null);
            }}
            className={`px-3 py-1 text-xs font-mono uppercase tracking-wider transition-colors ${
              period === "7d"
                ? "bg-brand-black text-brand-white font-bold"
                : "bg-transparent text-brand-muted hover:text-brand-black"
            }`}
          >
            Últimos 7 días
          </button>
          <button
            onClick={() => {
              setPeriod("30d");
              setHoveredPoint(null);
              setHoveredIndex(null);
            }}
            className={`px-3 py-1 text-xs font-mono uppercase tracking-wider transition-colors ${
              period === "30d"
                ? "bg-brand-black text-brand-white font-bold"
                : "bg-transparent text-brand-muted hover:text-brand-black"
            }`}
          >
            30 días
          </button>
        </div>
      </div>

      {/* Gráfico SVG */}
      <div className="relative w-full overflow-x-auto select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-48 sm:h-56 overflow-visible"
        >
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#111111" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#111111" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Líneas de Guía Horizontales */}
          {[0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = height - paddingBottom - ratio * chartHeight;
            const value = Math.round(ratio * maxAmount);
            return (
              <g key={ratio}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#E5E5E5"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 6}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="#888888"
                  fontFamily="monospace"
                >
                  ${Math.round(value / 1000)}k
                </text>
              </g>
            );
          })}

          {/* Área sombreada bajo la curva */}
          <path d={areaD} fill="url(#salesGradient)" />

          {/* Línea de la Curva */}
          <path
            d={pathD}
            fill="none"
            stroke="#111111"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Puntos y Etiquetas del Eje X */}
          {points.map((p, idx) => {
            const isHovered = hoveredIndex === idx;
            const showLabel =
              period === "7d" ||
              idx === 0 ||
              idx === points.length - 1 ||
              idx % Math.ceil(points.length / 6) === 0;

            return (
              <g key={idx}>
                {/* Punto interactivo */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 5 : period === "7d" ? 3.5 : 2.5}
                  fill={isHovered ? "#111111" : "#FFFFFF"}
                  stroke="#111111"
                  strokeWidth={isHovered ? "2.5" : "1.8"}
                  className="transition-all cursor-pointer"
                  onMouseEnter={() => {
                    setHoveredPoint(p.item);
                    setHoveredIndex(idx);
                  }}
                />

                {/* Área invisible amplia para facilitar hover con el mouse */}
                <rect
                  x={p.x - 15}
                  y={paddingTop}
                  width="30"
                  height={chartHeight + 10}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => {
                    setHoveredPoint(p.item);
                    setHoveredIndex(idx);
                  }}
                  onMouseLeave={() => {
                    setHoveredPoint(null);
                    setHoveredIndex(null);
                  }}
                />

                {/* Línea vertical en hover */}
                {isHovered && (
                  <line
                    x1={p.x}
                    y1={paddingTop}
                    x2={p.x}
                    y2={height - paddingBottom}
                    stroke="#111111"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Etiqueta Eje X */}
                {showLabel && (
                  <text
                    x={p.x}
                    y={height - 12}
                    textAnchor="middle"
                    fontSize="9"
                    fill={isHovered ? "#111111" : "#888888"}
                    fontWeight={isHovered ? "bold" : "normal"}
                    fontFamily="monospace"
                  >
                    {p.item.date}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Tooltip flotante al pasar el mouse */}
        {hoveredPoint && hoveredIndex !== null && points[hoveredIndex] && (
          <div
            className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 border border-brand-black bg-brand-black text-brand-white p-2 text-xs font-mono shadow-lg transition-all"
            style={{
              left: `${(points[hoveredIndex].x / width) * 100}%`,
              top: `${(points[hoveredIndex].y / height) * 100}%`,
            }}
          >
            <div className="font-bold text-[11px] text-brand-white flex items-center justify-between gap-3">
              <span>{hoveredPoint.label}</span>
              <span className="text-[10px] text-neutral-300 font-normal">
                {hoveredPoint.orders} {hoveredPoint.orders === 1 ? "pedido" : "pedidos"}
              </span>
            </div>
            <div className="text-sm font-bold text-brand-white mt-0.5">
              {formatPrice(hoveredPoint.amount)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
