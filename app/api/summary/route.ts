import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Daily macro totals for a given date (defaults to today).
export async function GET(req: NextRequest) {
  const dateParam = req.nextUrl.searchParams.get("date");
  const date = dateParam ? new Date(dateParam) : new Date();

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const entries = await prisma.entry.findMany({
    where: { loggedAt: { gte: startOfDay, lte: endOfDay } },
    include: { food: true },
  });

  const totals = entries.reduce(
    (acc, entry) => {
      acc.calories += entry.food.calories * entry.servings;
      acc.protein += entry.food.protein * entry.servings;
      acc.carbs += entry.food.carbs * entry.servings;
      acc.fat += entry.food.fat * entry.servings;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return NextResponse.json(totals);
}
