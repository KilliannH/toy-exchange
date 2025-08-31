import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export function createToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function createEmailVerificationToken(userId: string, email: string) {
  const token = createToken();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await prisma.emailVerificationToken.create({ data: { token, userId, email, expires } });
  return token;
}

export async function consumeEmailVerificationToken(token: string) {
  const record = await prisma.emailVerificationToken.findUnique({ where: { token } });
  if (!record) return null;
  if (record.expires < new Date()) {
    await prisma.emailVerificationToken.delete({ where: { token } });
    return "expired";
    }
  await prisma.user.update({ where: { id: record.userId }, data: { emailVerified: new Date() } });
  await prisma.emailVerificationToken.deleteMany({ where: { userId: record.userId } });
  return "ok";
}