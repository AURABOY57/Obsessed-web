import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Limpiando registros de pedidos...");
  const items = await prisma.orderItem.deleteMany({});
  console.log(`- Items eliminados: ${items.count}`);

  const orders = await prisma.order.deleteMany({});
  console.log(`- Pedidos eliminados: ${orders.count}`);

  console.log("✅ Todos los pedidos han sido eliminados de la base de datos.");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
