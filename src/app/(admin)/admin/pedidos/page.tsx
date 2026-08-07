import React from "react";
import { prisma } from "@/lib/prisma";
import { OrdersManagementView } from "@/components/admin/OrdersManagementView";
import { OrderData } from "@/components/admin/OrderCard";

export const dynamic = "force-dynamic";

const DEMO_ORDERS: OrderData[] = [
  {
    id: "ord-1",
    orderNumber: "ORD-2408-7821",
    customerName: "Matías Gómez",
    customerPhone: "3514567890",
    customerAddress: "Av. Colón 1450, Piso 4, Córdoba Capital",
    shippingCarrier: "Correo Argentino",
    trackingNumber: "00003829104",
    status: "PENDING",
    total: 48000,
    paymentMethod: "WHATSAPP_COORDINATE",
    notes: "Cliente consultó por transferencia Bancor.",
    createdAt: new Date().toISOString(),
    items: [
      {
        id: "item-1",
        name: "Mate Imperial Premium Noir",
        variantName: "Virola Cincelada",
        quantity: 1,
        unitPrice: 48000,
        subtotal: 48000,
      },
    ],
  },
  {
    id: "ord-2",
    orderNumber: "ORD-2408-6512",
    customerName: "Valentina Rossi",
    customerPhone: "3541678912",
    customerAddress: "San Martín 320, Villa Carlos Paz",
    shippingCarrier: "Cadetería / Mensajería",
    trackingNumber: "CADETE-04",
    status: "CONFIRMED",
    total: 86500,
    paymentMethod: "WHATSAPP_COORDINATE",
    notes: "Comprobante de pago verificado. En preparación.",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    items: [
      {
        id: "item-2",
        name: "Termo Obsidian Matte 1L",
        variantName: "Negro Mate",
        quantity: 1,
        unitPrice: 68000,
        subtotal: 68000,
      },
      {
        id: "item-3",
        name: "Bombilla Pico de Loro Alpaca",
        variantName: "Cincelada",
        quantity: 1,
        unitPrice: 18500,
        subtotal: 18500,
      },
    ],
  },
  {
    id: "ord-3",
    orderNumber: "ORD-2408-5420",
    customerName: "Facundo Morales",
    customerPhone: "3519988776",
    customerAddress: "Ituzaingó 840, Nueva Córdoba",
    shippingCarrier: "Andreani",
    trackingNumber: "AND-99281726",
    status: "SHIPPED",
    total: 42000,
    paymentMethod: "WHATSAPP_COORDINATE",
    notes: "Despachado a las 11:30hs.",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    items: [
      {
        id: "item-4",
        name: "Mate Torpedo Cuero Seleccionado",
        variantName: "Cuero Marrón",
        quantity: 1,
        unitPrice: 42000,
        subtotal: 42000,
      },
    ],
  },
  {
    id: "ord-4",
    orderNumber: "ORD-2408-4109",
    customerName: "Lucía Fernández",
    customerPhone: "1145672233",
    customerAddress: "Av. Santa Fe 2100, CABA",
    shippingCarrier: "Correo Argentino",
    trackingNumber: "00002910482",
    status: "DELIVERED",
    total: 66500,
    paymentMethod: "WHATSAPP_COORDINATE",
    notes: "Entregado con éxito en sucursal.",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    items: [
      {
        id: "item-5",
        name: "Mate Imperial Premium Noir",
        variantName: "Virola Lisa",
        quantity: 1,
        unitPrice: 48000,
        subtotal: 48000,
      },
      {
        id: "item-6",
        name: "Bombilla Alpaca",
        variantName: "Resorte",
        quantity: 1,
        unitPrice: 18500,
        subtotal: 18500,
      },
    ],
  },
];

export default async function AdminOrdersPage() {
  let orders: OrderData[] = DEMO_ORDERS;

  try {
    const data = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    if (data && data.length > 0) {
      orders = data.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        customerPhone: o.customerPhone,
        customerEmail: o.customerEmail,
        customerAddress: o.customerAddress,
        shippingCarrier: o.shippingCarrier,
        trackingNumber: o.trackingNumber,
        status: o.status,
        total: Number(o.total),
        paymentMethod: o.paymentMethod,
        notes: o.notes,
        createdAt: o.createdAt.toISOString(),
        items: o.items.map((it) => ({
          id: it.id,
          name: it.product?.name,
          variantName: it.variantName,
          quantity: it.quantity,
          unitPrice: Number(it.unitPrice),
          subtotal: Number(it.subtotal),
          product: it.product ? { name: it.product.name, imageUrl: it.product.imageUrl } : undefined,
        })),
      }));
    }
  } catch (error) {
    console.warn("[ADMIN_ORDERS_DB_FALLBACK]:", error);
  }

  return <OrdersManagementView initialOrders={orders} />;
}
