import { prisma } from "../src/lib/prisma";

async function main() {
  const orders = await prisma.order.findMany({
    include: {
      items: true,
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  console.log(`Total orders in DB: ${orders.length}`);
  console.log(JSON.stringify(orders, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
