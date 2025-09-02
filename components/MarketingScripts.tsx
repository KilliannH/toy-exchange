"use client";

import Script from "next/script";
import { useEffect } from "react";

export default function MarketingScripts() {
  const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  useEffect(() => {
    const prefs = localStorage.getItem("cookie-preferences");
    if (prefs) {
      const parsed = JSON.parse(prefs);
      if (parsed.marketing && typeof window !== "undefined" && window.fbq) {
        // Si consentement marketing => active Meta Pixel
        window.fbq("consent", "grant");
        window.fbq("track", "PageView");
      }
    }
  }, []);

  if (!PIXEL_ID) return null;

  return (
    <>
      {/* Charge la librairie Meta Pixel */}
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

          // Par défaut, consentement refusé
          fbq('consent', 'revoke');
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