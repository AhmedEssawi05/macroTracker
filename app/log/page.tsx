import { prisma } from "@/lib/prisma";
import { LogForm } from "@/components/LogForm";
import { formatLocalDate, parseLocalDateOrToday } from "@/lib/date";

export const dynamic = "force-dynamic";

export default async function LogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { date: dateParam } = await searchParams;
  const initialDate = formatLocalDate(
    parseLocalDateOrToday(typeof dateParam === "string" ? dateParam : undefined)
  );
  const today = formatLocalDate(new Date());
  const foods = await prisma.food.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">Log food</h1>
      <LogForm
        initialDate={initialDate}
        today={today}
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
