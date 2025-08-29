// app/api/exchanges/mine/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const exchanges = await prisma.exchange.findMany({
      where: {
        OR: [
          { requesterId: userId }, // ceux que j’ai envoyés
          { toy: { userId } },     // ceux reçus (jouet m’appartient)
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        requester: { select: { id: true, name: true, email: true } },
        toy: {
          select: {
            id: true,
            title: true,
            status: true,
            user: { select: { id: true, name: true, email: true } },
            images: { select: { url: true }, take: 1 },
          },
        },
        proposedToy: {
          select: {
            id: true,
            title: true,
            status: true,
            images: { select: { url: true }, take: 1 },
          },
        },
        review: true,
      },
    });

    return NextResponse.json(exchanges);
  } catch (error) {
    console.error("Error fetching exchanges:", error);
    return NextResponse.json({ error: "Failed to fetch exchanges" }, { status: 500 });
  }
}
