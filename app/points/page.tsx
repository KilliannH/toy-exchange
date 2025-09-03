// app/points/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import PointsPageClient from "./PointsPageClient";

export default async function PointsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }

  // Récupérer les points actuels de l'utilisateur
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      points: true
    }
  });

  if (!user) {
    redirect('/login');
  }

  return <PointsPageClient user={user} />;
}