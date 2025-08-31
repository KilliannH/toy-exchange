// lib/rate-limit.ts
import { prisma } from "@/lib/prisma";

interface RateLimitOptions {
  identifier: string;
  limit: number;
  duration: number; // en millisecondes
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: Date;
}

/**
 * Implémente un rate limiting basé sur la base de données
 * @param options - Configuration du rate limiting
 * @returns Résultat de la vérification
 */
export async function rateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  const { identifier, limit, duration } = options;
  const now = new Date();
  const windowStart = new Date(now.getTime() - duration);

  try {
    // Transaction pour éviter les race conditions
    const result = await prisma.$transaction(async (tx) => {
      // Nettoyer les anciens enregistrements expirés
      await tx.rateLimitLog.deleteMany({
        where: {
          createdAt: {
            lt: windowStart
          }
        }
      });

      // Compter les tentatives actuelles dans la fenêtre de temps
      const currentAttempts = await tx.rateLimitLog.count({
        where: {
          identifier,
          createdAt: {
            gte: windowStart
          }
        }
      });

      // Vérifier si la limite est dépassée
      if (currentAttempts >= limit) {
        // Trouver la tentative la plus ancienne pour calculer le reset time
        const oldestAttempt = await tx.rateLimitLog.findFirst({
          where: {
            identifier,
            createdAt: {
              gte: windowStart
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        });

        const resetTime = oldestAttempt 
          ? new Date(oldestAttempt.createdAt.getTime() + duration)
          : new Date(now.getTime() + duration);

        return {
          success: false,
          remaining: 0,
          resetTime
        };
      }

      // Enregistrer cette tentative
      await tx.rateLimitLog.create({
        data: {
          identifier,
          createdAt: now
        }
      });

      return {
        success: true,
        remaining: limit - currentAttempts - 1,
        resetTime: new Date(now.getTime() + duration)
      };
    });

    return result;

  } catch (error) {
    console.error("Erreur dans le rate limiting:", error);
    // En cas d'erreur, on autorise par défaut (fail-open)
    return {
      success: true,
      remaining: limit - 1,
      resetTime: new Date(now.getTime() + duration)
    };
  }
}

/**
 * Version simplifiée pour les cas où on veut juste vérifier sans compter
 */
export async function checkRateLimit(identifier: string, limit: number, duration: number): Promise<boolean> {
  const result = await rateLimit({ identifier, limit, duration });
  return result.success;
}

/**
 * Reset manuel d'un rate limit pour un identifiant donné
 */
export async function resetRateLimit(identifier: string): Promise<void> {
  try {
    await prisma.rateLimitLog.deleteMany({
      where: { identifier }
    });
  } catch (error) {
    console.error("Erreur lors du reset du rate limit:", error);
  }
}

/**
 * Nettoie tous les logs de rate limit expirés (à exécuter périodiquement)
 */
export async function cleanupRateLimitLogs(olderThanHours: number = 24): Promise<number> {
  try {
    const cutoffDate = new Date(Date.now() - (olderThanHours * 60 * 60 * 1000));
    
    const result = await prisma.rateLimitLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate
        }
      }
    });

    return result.count;
  } catch (error) {
    console.error("Erreur lors du nettoyage des logs de rate limit:", error);
    return 0;
  }
}