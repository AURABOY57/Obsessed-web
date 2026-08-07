import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number | string | { toString: () => string }
): string {
  const numericPrice = typeof price === "number" ? price : Number(price.toString());
  if (isNaN(numericPrice)) return "$ 0";
  
  // Formateo consistente y determinista entre Server (Node.js) y Cliente (Navegadores)
  const formatted = Math.round(numericPrice)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
  return `$ ${formatted}`;
}

export function buildWhatsAppLink({
  phone,
  products,
  total,
  customerName,
}: {
  phone: string;
  products: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  customerName?: string;
}): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  
  let message = `Hola *obsessed.cba*! 👋\n`;
  if (customerName) {
    message += `Mi nombre es *${customerName}*.\n`;
  }
  message += `Quisiera coordinar la compra del siguiente pedido:\n\n`;

  products.forEach((item, index) => {
    message += `• *${item.name}* (x${item.quantity}) - ${formatPrice(item.price * item.quantity)}\n`;
  });

  message += `\n💰 *Total:* ${formatPrice(total)}\n\n¿Cómo podemos coordinar el pago y el envío? ¡Muchas gracias!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
