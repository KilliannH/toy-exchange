// app/api/toys/[id]/similar/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const toy = await prisma.toy.findUnique({
    where: { id: params.id },
    select: { category: true, ageMin: true, ageMax: true }
  });

  if (!toy) {
    return NextResponse.json({ error: "Jouet introuvable" }, { status: 404 });
  }

  const similarToys = await prisma.toy.findMany({
    where: {
      AND: [
        { id: { not: params.id } },
        { category: toy.category },
        {
          OR: [
            { ageMin: { gte: toy.ageMin, lte: toy.ageMax } },
            { ageMax: { gte: toy.ageMin, lte: toy.ageMax } }
          ]
        }
      ]
    },
    take: 6,
    include: {
      images: true,
      user: { select: { name: true, email: true } }
    }
  });

  return NextResponse.json(similarToys);
}