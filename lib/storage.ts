// lib/storage.ts
import { Storage, Bucket } from "@google-cloud/storage";

let bucket: Bucket | null = null;

export function getBucket(): Bucket {
  if (bucket) return bucket;

  if (!process.env.GCP_BUCKET_NAME) {
    console.warn("⚠️ GCP_BUCKET_NAME is not set. Returning dummy bucket.");
    // 👉 on renvoie un faux objet pour le build (évite le crash)
    // Mais ça plantera si quelqu’un l’utilise en runtime sans variable définie
    return {} as Bucket;
  }

  const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID,
    credentials: {
      client_email: process.env.GCP_CLIENT_EMAIL,
      private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
  });

  bucket = storage.bucket(process.env.GCP_BUCKET_NAME);
  return bucket;
}