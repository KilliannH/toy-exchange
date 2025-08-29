// app/profile/page.tsx (Server Component)
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileClient from "@/components/ProfileClient";
import { Frown } from "lucide-react"; // Import a suitable icon

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-3xl p-12 text-center max-w-md">
          <div className="text-8xl mb-6 text-red-400 animate-pulse">
            <Frown size={96} className="mx-auto" />
          </div>
          <h2 className="text-3xl font-bold text-red-400 mb-4">Profil introuvable</h2>
          <p className="text-red-300">Une erreur s'est produite lors du chargement</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  let stats = {
    toysCount: 0,
    exchangesCount: 0,
    donationsCount: 0,
    avgRating: 0,
    memberSince: "Nouveau"
  };

  if (user) {
    stats.toysCount = await prisma.toy.count({
      where: { userId: user.id }
    });

    stats.donationsCount = await prisma.toy.count({
      where: { 
        userId: user.id,
        mode: "DON"
      }
    });

    const monthsSinceJoin = Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30));
    stats.memberSince = monthsSinceJoin === 0 ? "Nouveau" : `${monthsSinceJoin} mois`;

    try {
      stats.exchangesCount = await prisma.exchange.count({
        where: {
          OR: [
            { requesterId: user.id },
            { toy: { userId: user.id } }
          ],
          status: "COMPLETED"
        }
      });

      const avgResult = await prisma.review.aggregate({
        where: { revieweeId: user.id },
        _avg: { rating: true }
      });
      stats.avgRating = avgResult._avg.rating || 0;
    } catch (error) {
      stats.exchangesCount = 0;
      stats.avgRating = 0;
    }
  }

  return <ProfileClient user={user} stats={stats} />;
}