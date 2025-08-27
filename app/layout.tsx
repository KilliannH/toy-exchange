import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavBar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TroqueJouets",
  description: "Échange de jouets entre parents",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <NavBar />
        <main className="min-h-screen bg-gray-50">{children}</main>
      </body>
    </html>
  );
}