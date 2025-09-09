// app/profile/page.tsx (Server Component)
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileClient from "@/components/ProfileClient";
import { Frown } from "lucide-react";
import { getBucket } from "@/lib/storage";
import { getTranslations } from 'next-intl/server';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const t = await getTranslations('profilePage');

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-3xl p-12 text-center max-w-md">
          <div className="text-8xl mb-6 text-red-400 animate-pulse">
            <Frown size={96} className="mx-auto" />
          </div>
          <h2 className="text-3xl font-bold text-red-400 mb-4">{t('error.title')}</h2>
          <p className="text-red-300">{t('error.description')}</p>
        </div>
      </div>
    );
  }

  // ⚡ Signed URL si image privée
  let signedImageUrl: string | null = null;
  if (user.image) {
    const objectPath = user.image
      .replace(`https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME}/`, "")
      .split("?")[0];
    const bucket = getBucket();
    const file = bucket.file(objectPath);
    const [url] = await file.getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + 5 * 60 * 1000, // 5 min
    });
    signedImageUrl = url;
  }

  // Replace plain URL by signed one
  const userWithSignedImage = { ...user, image: signedImageUrl };

  // Calculate statistics
  let stats = {
    toysCount: 0,
    exchangesCount: 0,
    donationsCount: 0,
    avgRating: 0,
    memberSince: t('stats.newMember')
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
    stats.memberSince = monthsSinceJoin === 0 
      ? t('stats.memberSinceNew') 
      : t('stats.memberSinceMonths', { months: monthsSinceJoin });

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

  return <ProfileClient user={userWithSignedImage} stats={stats} />;
}