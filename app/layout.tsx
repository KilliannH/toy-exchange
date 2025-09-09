import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import NavBar from "@/components/Navbar";
import { Toaster } from "react-hot-toast"
import Script from "next/script";
import CookieNotice from "@/components/CookieNotice";
import AnalyticsScripts from "@/components/AnalyticsScripts";
import MarketingScripts from "@/components/MarketingScripts";
import {NextIntlClientProvider} from 'next-intl';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://example.com"),
  title: {
    default: "ToyExchange — Toy Exchange and Donation Near You",
    template: "%s | ToyExchange",
  },
  description: "Easily find, swap, or donate toys. Local community, happy toys.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "ToyExchange",
    url: "/",
    title: "ToyExchange — Toy exchange and donation",
    description: "Find, trade or donate toys easily.",
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
    title: "ToyExchange — Toy exchange and donation",
    description: "Find, trade or donate toys easily.",
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/og-default.png`],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  return (
    <html lang="fr">
      <body className={inter.className}>
        {/* Google Maps API - seulement si la clé existe */}
        {googleMapsKey && (
          <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&libraries=places`}
            strategy="beforeInteractive"
          />
        )}

        <Providers>
          <NextIntlClientProvider>
          <NavBar />
          <main className="min-h-screen bg-gray-50">{children}</main>
          <CookieNotice />
          </NextIntlClientProvider>
          <AnalyticsScripts />
          <MarketingScripts />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1f2937",
                color: "#fff",
                borderRadius: "0.75rem",
              },
              success: {
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
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