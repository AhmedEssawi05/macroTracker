import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Returns entries for a given day (defaults to today), local-date based via
// a `date` query param in YYYY-MM-DD form.
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
    orderBy: { loggedAt: "asc" },
  });

  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { foodId, servings, mealType, loggedAt } = body;

  if (!foodId) {
    return NextResponse.json({ error: "foodId is required" }, { status: 400 });
  }

  const entry = await prisma.entry.create({
    data: {
      foodId,
      servings: servings != null ? Number(servings) : 1,
      mealType: mealType ?? "SNACK",
      loggedAt: loggedAt ? new Date(loggedAt) : new Date(),
    },
    include: { food: true },
  });

  return NextResponse.json(entry, { status: 201 });
}
