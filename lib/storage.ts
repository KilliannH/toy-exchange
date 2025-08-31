// lib/storage.ts
import { Storage, Bucket } from "@google-cloud/storage";

let _bucket: Bucket | null = null;

export function getBucket(): Bucket {
  if (_bucket) return _bucket;

  const bucketName = process.env.GCP_BUCKET_NAME;
  if (!bucketName) {
    // On NE veut PAS exécuter ça au build. Donc: cette fonction ne doit JAMAIS être appelée pendant le build.
    throw new Error("GCP_BUCKET_NAME is not set");
  }

  // Sur Cloud Run, préfère ADC: ne fournis pas credentials si tu utilises le Service Account de Cloud Run
  const storage = new Storage(
    process.env.GCP_CLIENT_EMAIL && process.env.GCP_PRIVATE_KEY
      ? {
          projectId: process.env.GCP_PROJECT_ID,
          credentials: {
            client_email: process.env.GCP_CLIENT_EMAIL,
            private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, "\n"),
          },
        }
      : undefined
  );

  _bucket = storage.bucket(bucketName);
  return _bucket;
}
