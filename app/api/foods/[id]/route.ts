import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const food = await prisma.food.findUnique({ where: { id } });
  if (!food) return NextResponse.json({ error: "Food not found" }, { status: 404 });
  return NextResponse.json(food);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  await prisma.food.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
