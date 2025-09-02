"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export default function AnalyticsScripts() {
  const [isClient, setIsClient] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    setIsClient(true);
    
    // Vérifier le consentement après le montage du composant
    const prefs = localStorage.getItem("cookie-preferences");
    if (prefs) {
      try {
        const parsed = JSON.parse(prefs);
        if (parsed.analytics) {
          setConsentGiven(true);
          // Attendre que gtag soit chargé avant de mettre à jour
          setTimeout(() => {
            if (window.gtag) {
              window.gtag("consent", "update", {
                ad_storage: "granted",
                analytics_storage: "granted",
              });
            }
          }, 1000);
        }
      } catch (e) {
        console.error("Erreur parsing cookie preferences:", e);
      }
    }
  }, []);

  // Ne pas afficher si pas côté client ou pas de GA_ID
  if (!isClient || !GA_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />

      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          
          // Déclarer gtag globalement
          window.gtag = gtag;
          
          gtag('js', new Date());

          // Consent Mode par défaut
          gtag('consent', 'default', {
            ad_storage: 'denied',
            analytics_storage: 'denied',
            wait_for_update: 500
          });

          gtag('config', '${GA_ID}', {
            send_page_view: false, // On enverra manuellement après consentement
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  );
}