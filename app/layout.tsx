import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import NavBar from "@/components/Navbar";
import { Toaster } from "react-hot-toast"
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Toy Exchange",
  description: "Échange de jouets entre parents",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        {/* Script pour l'API Google Maps JavaScript */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_PLACES_APIKEY}&libraries=places`}
          strategy="beforeInteractive"
        />
        {/* Autres balises meta, link, etc. */}
      </head>
      <body className={inter.className}>
        <Providers>
          <NavBar />
          <main className="min-h-screen bg-gray-50">{children}</main>
          <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1f2937", // gris foncé
              color: "#fff",
              borderRadius: "0.75rem",
            },
            success: {
              iconTheme: {
                primary: "#10b981", // vert
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444", // rouge
                secondary: "#fff",
              },
            },
          }}
        />
        </Providers>
      </body>
    </html>
  );
}