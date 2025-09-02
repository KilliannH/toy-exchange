// app/admin/page.tsx
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import AdminDashboardClient from "./AdminDashboardClient";
import { prisma } from "@/lib/prisma";
import { getBucket } from "@/lib/storage";

export default async function AdminDashboardPage() {

    try {
        await requireRole('ADMIN');
    } catch (error) {
        redirect('/login');
    }

    // Récupérer les statistiques de base
    const stats = await Promise.all([
        prisma.user.count(),
        prisma.toy.count()
    ]);

    const [usersCount, toysCount] = stats;

    // Récupérer les jouets récents avec leurs propriétaires
    const recentToys = await prisma.toy.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            },
            images: {
                select: { url: true },
                take: 1
            }
        }
    });

    // Générer des signed URLs pour les images de chaque jouet
    const recentToysWithSignedImages = await Promise.all(
        recentToys.map(async (toy) => {
            const imagesWithSignedUrls = await Promise.all(
                toy.images.map(async (img) => {
                    const bucket = getBucket();
                    const file = bucket.file(img.url);
                    const [signedUrl] = await file.getSignedUrl({
                        version: "v4",
                        action: "read",
                        expires: Date.now() + 15 * 60 * 1000, // 15 min
                    });
                    return { ...img, signedUrl };
                })
            );

            return {
                ...toy,
                images: imagesWithSignedUrls
            };
        })
    );

    // Récupérer les utilisateurs récents
    const recentUsers = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            emailVerified: true,
            _count: {
                select: {
                    toys: true
                }
            }
        }
    });

    const dashboardData = {
        stats: {
            users: usersCount,
            toys: toysCount,
            exchanges: 0,
            pendingReports: 0
        },
        recentToys: recentToysWithSignedImages, // Nom cohérent
        pendingReports: [],
        recentUsers
    };

    return <AdminDashboardClient data={dashboardData} />;
}