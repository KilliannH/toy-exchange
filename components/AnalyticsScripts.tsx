"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export default function AnalyticsScripts() {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    setConsent(localStorage.getItem("cookie-consent"));
  }, []);

  if (consent !== "accepted") return null;

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=GTM-PHXDR7FC`}
      strategy="afterInteractive"
    />
  );
}