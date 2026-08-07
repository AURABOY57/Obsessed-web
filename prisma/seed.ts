import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SEED_PRODUCTS = [
  {
    name: "Mate Imperial Premium Noir",
    slug: "mate-imperial-premium-noir",
    description:
      "Calabaza brasilera de paredes gruesas seleccionada a mano. Forrado en cuero vacuno legítimo color negro noche con costura fina artesanal. Virola y fleje de alpaca maciza cincelada a mano con motivos criollos geométricos. Base reforzada de 4 patas firmes.",
    price: 48000,
    stock: 8,
    imageUrl: "/images/products/mate-imperial-noir.png",
    category: "Mates",
    isActive: true,
  },
  {
    name: "Mate Torpedo Cuero Seleccionado",
    slug: "mate-torpedo-cuero-seleccionado",
    description:
      "Diseño ergonómico y estilizado tipo Torpedo Uruguayo. Confeccionado en calabaza premium y revestido en cuero curtido de primera calidad. Virola lisa de acero quirúrgico / alpaca pulida a espejo. Ideal para un cebado parejo y rendidor.",
    price: 42000,
    stock: 6,
    imageUrl: "/images/products/mate-torpedo-cuero.png",
    category: "Mates",
    isActive: true,
  },
  {
    name: "Termo Obsidian Matte 1L",
    slug: "termo-obsidian-matte-1l",
    description:
      "Termo de acero inoxidable bicapa 304 de 1 litro con recubrimiento exterior negro mate de alta resistencia. Mantiene la temperatura del agua fría o caliente por más de 24 horas. Incluye pico matero cebador de precisión a 360° antigoteo.",
    price: 68000,
    stock: 10,
    imageUrl: "/images/products/termo-obsidian-black.png",
    category: "Termos",
    isActive: true,
  },
  {
    name: "Bombilla Pico de Loro Alpaca Cincelada",
    slug: "bombilla-pico-de-loro-alpaca-cincelada",
    description:
      "Bombilla artesanal pico de loro de alpaca maciza de 19 cm. Caño grueso de excelente caudal con filtro tipo cuchara o ranuras desmontables para fácil limpieza. Detalle cincelado artesanal en el lomo con terminación pulida de autor.",
    price: 18500,
    stock: 15,
    imageUrl: "/images/products/bombilla-alpaca-pico.png",
    category: "Bombillas",
    isActive: true,
  },
];

async function main() {
  console.log("🌱 Iniciando seed de base de datos para obsessed.cba...");

  for (const product of SEED_PRODUCTS) {
    const existing = await prisma.product.findUnique({
      where: { slug: product.slug },
    });

    if (existing) {
      await prisma.product.update({
        where: { slug: product.slug },
        data: product,
      });
      console.log(`✓ Producto actualizado: ${product.name}`);
    } else {
      await prisma.product.create({
        data: product,
      });
      console.log(`✓ Producto creado: ${product.name}`);
    }
  }

  console.log("✨ Seed completado con éxito.");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
