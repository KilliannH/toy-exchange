"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export default function MarketingScripts() {
  const [isClient, setIsClient] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  useEffect(() => {
    setIsClient(true);
    
    const prefs = localStorage.getItem("cookie-preferences");
    if (prefs) {
      try {
        const parsed = JSON.parse(prefs);
        if (parsed.marketing) {
          setHasConsent(true);
          // Attendre que fbq soit chargé
          setTimeout(() => {
            if (window.fbq) {
              window.fbq("consent", "grant");
              window.fbq("track", "PageView");
            }
          }, 1000);
        }
      } catch (e) {
        console.error("Erreur parsing cookie preferences:", e);
      }
    }
  }, []);

  // Ne pas afficher si pas côté client ou pas de PIXEL_ID
  if (!isClient || !PIXEL_ID) return null;

  return (
    <>
      <Script id="meta-pixel-base" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');

          fbq('init', '${PIXEL_ID}');
          fbq('consent', 'revoke');
          
          // Rendre fbq disponible globalement
          window.fbq = fbq;
        `}
      </Script>

      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}