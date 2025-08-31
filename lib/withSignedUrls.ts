import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});
const bucket = storage.bucket(process.env.GCP_BUCKET_NAME!);

export async function withSignedUrls(toys: any[]) {
  return Promise.all(
    toys.map(async (toy) => {
      const signedImages = await Promise.all(
        toy.images.map(async (img: any) => {
          const [signedUrl] = await bucket.file(img.url).getSignedUrl({
            version: "v4",
            action: "read",
            expires: Date.now() + 15 * 60 * 1000,
          });
          return { ...img, signedUrl };
        })
      );
      return { ...toy, images: signedImages };
    })
  );
}