// app/user/[id]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PublicProfileClient from "@/components/PublicProfileClient";
import { withSignedUrls } from "@/lib/withSignedUrls";
import { getBucket } from "@/lib/storage";
import { getTranslations } from 'next-intl/server';

interface Props {
  params: {
    id: string;
  };
}

export default async function PublicUserProfilePage({ params }: Props) {
  const idParams = await params;
  const t = await getTranslations('publicProfile');

  // Récupérer les informations publiques de l'utilisateur
  const user = await prisma.user.findUnique({
    where: { id: idParams.id },
    select: {
      id: true,
      name: true,
      email: false, // Ne pas exposer l'email
      city: true,
      createdAt: true,
      image: true,
      // Relations pour les statistiques
      toys: {
        select: {
          id: true,
          title: true,
          images: {
            select: { url: true },
            take: 1
          },
          mode: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 6 // Derniers jouets pour l'aperçu
      },
      _count: {
        select: {
          toys: true
        }
      }
    }
  });

  if (!user) {
    notFound();
  }

  const toysWithSigned = await withSignedUrls(user.toys);
  const signedImage = user.image ? await getSignedUrl(user.image) : null;

  // Calculer les statistiques
  const stats = {
    toysCount: user._count.toys,
    donationsCount: user.toys.filter(toy => toy.mode === 'DON').length,
    exchangesCount: 0, // Sera calculé séparément
    avgRating: 0, // Sera calculé séparément
    memberSince: t('stats.newMember')
  };

  // Calculer les échanges complétés
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
  } catch (error) {
    console.error("Erreur calcul échanges:", error);
  }

  // Calculer la note moyenne
  try {
    const avgResult = await prisma.review.aggregate({
      where: { revieweeId: user.id },
      _avg: { rating: true },
      _count: { rating: true }
    });
    stats.avgRating = avgResult._avg.rating || 0;
  } catch (error) {
    console.error("Erreur calcul notes:", error);
  }

  // Calculer l'ancienneté
  const monthsSinceJoin = Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30));
  stats.memberSince = monthsSinceJoin === 0 
    ? t('stats.memberSinceNew') 
    : t('stats.memberSinceMonths', { months: monthsSinceJoin });

  // Récupérer les avis récents
  const recentReviews = await prisma.review.findMany({
    where: { revieweeId: user.id },
    include: {
      reviewer: {
        select: {
          name: true,
          id: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  return (
    <PublicProfileClient 
      user={{ ...user, image: signedImage, toys: toysWithSigned }}
      stats={stats}
      recentReviews={recentReviews}
    />
  );
}

export async function getSignedUrl(image: string): Promise<string> {
  if (!image) return "";

  const bucket = getBucket();

  // Extraire le chemin de l'objet (ex: avatars/xxx.png)
  const objectPath = image
  .replace(`https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME}/`, "")
  .split("?")[0];

  const file = bucket.file(objectPath);

  const [url] = await file.getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + 5 * 60 * 1000, // 5 min
  });

  return url;
}