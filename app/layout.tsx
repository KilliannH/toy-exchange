import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import NavBar from "@/components/Navbar";
import { Toaster } from "react-hot-toast"
import Script from "next/script";
import CookieNotice from "@/components/CookieNotice";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://example.com"),
  title: {
    default: "ToyExchange — Échange & don de jouets près de chez vous",
    template: "%s | ToyExchange",
  },
  description: "Trouvez, échangez ou donnez des jouets facilement. Une communauté locale, des jouets heureux.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "ToyExchange",
    url: "/",
    title: "ToyExchange — Échange & don de jouets",
    description: "Trouvez, échangez ou donnez des jouets facilement.",
    images: [
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/og-default.png`,
      width: 1200,
      height: 630,
    },
  ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ToyExchange — Échange & don de jouets",
    description: "Trouvez, échangez ou donnez des jouets facilement.",
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/og-default.png`],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        {/* Script pour l'API Google Maps JavaScript */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
        {/* Autres balises meta, link, etc. */}
      </head>
      <body className={inter.className}>
        <Providers>
          <NavBar />
          <main className="min-h-screen bg-gray-50">{children}</main>
          <CookieNotice />
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