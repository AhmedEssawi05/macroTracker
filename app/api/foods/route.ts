import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  const foods = await prisma.food.findMany({
    where: q
      ? { name: { contains: q } }
      : undefined,
    orderBy: { name: "asc" },
  });
  return NextResponse.json(foods);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { name, brand, servingSize, calories, protein, carbs, fat, fiber, sugar, sodium } = body;

  if (!name || calories == null || protein == null || carbs == null || fat == null) {
    return NextResponse.json(
      { error: "name, calories, protein, carbs, and fat are required" },
      { status: 400 }
    );
  }

  const food = await prisma.food.create({
    data: {
      name,
      brand: brand ?? null,
      servingSize: servingSize ?? "1 serving",
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fat: Number(fat),
      fiber: fiber != null ? Number(fiber) : null,
      sugar: sugar != null ? Number(sugar) : null,
      sodium: sodium != null ? Number(sodium) : null,
    },
  });

  return NextResponse.json(food, { status: 201 });
}
