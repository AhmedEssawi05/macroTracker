import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const foods = [
  {
    name: "Chicken breast, cooked",
    servingSize: "100g",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
  },
  {
    name: "White rice, cooked",
    servingSize: "1 cup",
    calories: 205,
    protein: 4.3,
    carbs: 45,
    fat: 0.4,
  },
  {
    name: "Egg, large",
    servingSize: "1 egg",
    calories: 72,
    protein: 6.3,
    carbs: 0.4,
    fat: 4.8,
  },
  {
    name: "Banana",
    servingSize: "1 medium",
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
  },
  {
    name: "Greek yogurt, plain",
    servingSize: "170g",
    calories: 100,
    protein: 17,
    carbs: 6,
    fat: 0.7,
  },
];

async function main() {
  for (const food of foods) {
    await prisma.food.upsert({
      where: { id: food.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
      update: {},
      create: { id: food.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), ...food },
    });
  }
  console.log(`Seeded ${foods.length} foods.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
