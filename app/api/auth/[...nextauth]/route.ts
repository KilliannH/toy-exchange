import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
  async signIn({ user }) {
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      select: { city: true, lat: true, lng: true },
    });

    // Retourne true = connexion OK
    // Retourne URL = redirection forcée
    if (!dbUser?.city || !dbUser?.lat || !dbUser?.lng) {
      return "/onboarding/city"; // 🚀 direct onboarding
    }

    return true; // 🚀 continue flow normal (→ dashboard par défaut)
  },
  async session({ session, token }) {
    if (session.user && token.sub) {
      const userDb = await prisma.user.findUnique({
        where: { id: token.sub },
        select: { id: true, city: true, lat: true, lng: true },
      });
      session.user.id = token.sub;
      session.user.city = userDb?.city || null;
      session.user.lat = userDb?.lat || null;
      session.user.lng = userDb?.lng || null;
    }
    return session;
  },
  async redirect({ url, baseUrl }) {
    // Si NextAuth reçoit une URL absolue → accepte uniquement si interne
    if (url.startsWith(baseUrl)) return url;
    return `${baseUrl}/dashboard`;
  }
},
  pages: {
    signIn: "/login", // 👈 redirige vers une page custom
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
