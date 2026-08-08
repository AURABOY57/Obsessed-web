import React from "react";
import { prisma } from "@/lib/prisma";
import { OrdersManagementView } from "@/components/admin/OrdersManagementView";
import { OrderData } from "@/components/admin/OrderCard";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  let orders: OrderData[] = [];

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
          name: it.product?.name || "Producto",
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
