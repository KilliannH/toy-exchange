import { getBucket } from "./storage";

export async function withSignedUrls(toys: any[]) {
    const bucket = getBucket();
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