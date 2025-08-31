// app/api/user/delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getBucket } from "@/lib/storage";

export async function deleteImageFile(imageUrl: string): Promise<void> {
  const bucket = getBucket();
  try {
    // Extraire le nom du fichier depuis l'URL
    // Exemple : https://storage.googleapis.com/bucket-name/images/user123/toy456.jpg
    // Ou : images/user123/toy456.jpg
    let fileName: string;
    
    if (imageUrl.startsWith('https://storage.googleapis.com/')) {
      // URL complète GCS
      const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;
      const urlPattern = new RegExp(`https://storage\\.googleapis\\.com/${bucketName}/(.+)`);
      const match = imageUrl.match(urlPattern);
      fileName = match?.[1] || '';
    } else if (imageUrl.startsWith('https://')) {
      // Autre format d'URL (CDN custom, etc.)
      const url = new URL(imageUrl);
      fileName = url.pathname.substring(1); // Enlever le "/" du début
    } else {
      // Déjà un nom de fichier relatif
      fileName = imageUrl;
    }

    if (!fileName) {
      console.warn(`Impossible d'extraire le nom du fichier depuis: ${imageUrl}`);
      return;
    }

    // Supprimer le fichier du bucket
    await bucket.file(fileName).delete();
    
    console.log(`Image supprimée avec succès: ${fileName}`);
    
  } catch (error: any) {
    // Ne pas faire échouer la transaction si l'image n'existe plus
    if (error.code === 404) {
      console.log(`Image déjà supprimée ou introuvable: ${imageUrl}`);
    } else {
      console.error(`Erreur lors de la suppression de l'image ${imageUrl}:`, error);
      // Optionnel : relancer l'erreur si critique
      // throw error;
    }
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Transaction pour supprimer toutes les données liées à l'utilisateur
    await prisma.$transaction(async (tx) => {
      // 1. Supprimer les avis donnés par l'utilisateur
      await tx.review.deleteMany({
        where: { reviewerId: userId }
      });

      // 2. Supprimer les avis reçus par l'utilisateur
      await tx.review.deleteMany({
        where: { revieweeId: userId }
      });

      // 3. Supprimer les échanges où l'utilisateur est demandeur
      await tx.exchange.deleteMany({
        where: { requesterId: userId }
      });

      // 4. Supprimer les échanges liés aux jouets de l'utilisateur
      await tx.exchange.deleteMany({
        where: {
          toy: {
            userId: userId
          }
        }
      });

      // 5. Supprimer les images des jouets de l'utilisateur
      // Note: Vous devriez aussi supprimer les fichiers physiques du stockage
      const userToys = await tx.toy.findMany({
        where: { userId: userId },
        select: { images: true }
      });

    // Exemple avec AWS S3, Cloudinary, ou stockage local
    
    for (const toy of userToys) {
      for (const image of toy.images) {
        // Supprimer le fichier physique
        await deleteImageFile(image.url);
      }
    }

      // Supprimer les enregistrements d'images
      await tx.toyImage.deleteMany({
        where: {
          toy: {
            userId: userId
          }
        }
      });

      // 6. Supprimer tous les jouets de l'utilisateur
      await tx.toy.deleteMany({
        where: { userId: userId }
      });

      // 8. Supprimer les messages envoyés par l'utilisateur
      await tx.message.deleteMany({
        where: { senderId: userId }
      });

      // 10. Supprimer les sessions Next-Auth
      await tx.session.deleteMany({
        where: { userId: userId }
      });

      // 11. Supprimer les comptes OAuth liés
      await tx.account.deleteMany({
        where: { userId: userId }
      });

      // 12. Enfin, supprimer l'utilisateur
      await tx.user.delete({
        where: { id: userId }
      });
    });
    

    return NextResponse.json(
      { message: "Compte supprimé avec succès" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur lors de la suppression du compte:", error);
    
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}