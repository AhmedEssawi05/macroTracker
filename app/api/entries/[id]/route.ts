import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  await prisma.entry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const { servings, mealType } = body;

  const entry = await prisma.entry.update({
    where: { id },
    data: {
      ...(servings != null ? { servings: Number(servings) } : {}),
      ...(mealType ? { mealType } : {}),
    },
    include: { food: true },
  });

  return NextResponse.json(entry);
}
