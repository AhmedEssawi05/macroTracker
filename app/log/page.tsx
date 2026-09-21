import { prisma } from "@/lib/prisma";
import { LogForm } from "@/components/LogForm";

export const dynamic = "force-dynamic";

export default async function LogPage() {
  const foods = await prisma.food.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">Log food</h1>
      <LogForm
        foods={foods.map((f) => ({
          id: f.id,
          name: f.name,
          brand: f.brand,
          servingSize: f.servingSize,
          calories: f.calories,
          protein: f.protein,
          carbs: f.carbs,
          fat: f.fat,
        }))}
      />
    </div>
  );
}
