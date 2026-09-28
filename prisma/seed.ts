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
  const savedFoods: Record<string, { id: string }> = {};
  for (const food of foods) {
    const id = food.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    savedFoods[food.name] = await prisma.food.upsert({
      where: { id },
      update: {},
      create: { id, ...food },
    });
  }
  console.log(`Seeded ${foods.length} foods.`);

  const today = new Date();
  const at = (hours: number, minutes: number) => {
    const d = new Date(today);
    d.setHours(hours, minutes, 0, 0);
    return d;
  };

  const demoEntries: { food: string; servings: number; mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK"; loggedAt: Date }[] = [
    { food: "Egg, large", servings: 2, mealType: "BREAKFAST", loggedAt: at(8, 15) },
    { food: "Greek yogurt, plain", servings: 1, mealType: "BREAKFAST", loggedAt: at(8, 20) },
    { food: "Chicken breast, cooked", servings: 1.5, mealType: "LUNCH", loggedAt: at(12, 45) },
    { food: "White rice, cooked", servings: 1, mealType: "LUNCH", loggedAt: at(12, 45) },
    { food: "Banana", servings: 1, mealType: "SNACK", loggedAt: at(15, 30) },
  ];

  let entryCount = 0;
  for (const entry of demoEntries) {
    const food = savedFoods[entry.food];
    const existing = await prisma.entry.findFirst({
      where: { foodId: food.id, mealType: entry.mealType, loggedAt: entry.loggedAt },
    });
    if (!existing) {
      await prisma.entry.create({
        data: {
          foodId: food.id,
          servings: entry.servings,
          mealType: entry.mealType,
          loggedAt: entry.loggedAt,
        },
      });
      entryCount++;
    }
  }
  console.log(`Seeded ${entryCount} logged entries for today.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
