// app/api/favorites/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { getBucket } from "@/lib/storage";

const bucket = getBucket();

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const favorites = await prisma.favorite.findMany({
            where: { userId: session.user.id },
            include: {
                toy: {
                    include: {
                        user: { select: { name: true, city: true } },
                        images: {
                            select: { id: true, url: true, },
                            take: 1, // Get only the first image for the thumbnail
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Generate signed URLs for the images
        const favoritesWithSignedUrls = await Promise.all(
            favorites.map(async (fav) => {
                const toy = fav.toy;
                if (toy.images && toy.images.length > 0 && toy.images[0].url) {
                    const file = bucket.file(toy.images[0].url);
                    const [signedUrl] = await file.getSignedUrl({
                        version: "v4",
                        action: "read",
                        expires: Date.now() + 15 * 60 * 1000, // 15 min
                    });
                    toy.images[0].signedUrl = signedUrl;
                }
                return { ...fav, toy };
            })
        );

        return NextResponse.json(favoritesWithSignedUrls);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
    }
}