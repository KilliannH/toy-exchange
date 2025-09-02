"use client";

import Script from "next/script";
import { useEffect } from "react";

export default function AnalyticsScripts() {
  // ⚠️ remplace par ton vrai ID GA4
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    const prefs = localStorage.getItem("cookie-preferences");
    if (prefs) {
      const parsed = JSON.parse(prefs);
      if (parsed.analytics) {
        // Si consentement analytics => on met à jour le consentement
        window.gtag?.("consent", "update", {
          ad_storage: "granted",
          analytics_storage: "granted",
        });
      }
    }
  }, []);

  if (!GA_ID) return null;

  return (
    <>
      {/* Charge la librairie gtag */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />

      {/* Initialisation avec Consent Mode (tout refusé par défaut) */}
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          // Consent Mode par défaut (refusé)
          gtag('consent', 'default', {
            ad_storage: 'denied',
            analytics_storage: 'denied'
          });

          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}