"use client";

import { useState, useEffect } from "react";
import { Cookie, X, Settings } from "lucide-react";
import Link from "next/link";
import { useCookieNoticeTranslations } from '../hooks/useCookieNoticeTranslations';

export default function CookieNotice() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const translations = useCookieNoticeTranslations();

  useEffect(() => {
    // Marquer que nous sommes côté client
    setIsClient(true);

    // Vérifier si l'utilisateur a déjà accepté les cookies
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-preferences', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true
    }));

    // Mettre à jour GA
    if (window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted",
      });
      window.gtag("event", "page_view");
    }

    // Mettre à jour Meta Pixel
    if (window.fbq) {
      window.fbq("consent", "grant");
      window.fbq("track", "PageView");
    }

    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('cookie-consent', 'necessary-only');
    localStorage.setItem('cookie-preferences', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false
    }));
    setIsVisible(false);
  };

  const handleCustomize = () => {
    setShowDetails(!showDetails);
  };

  // Ne rien afficher jusqu'à ce qu'on soit côté client
  if (!isClient || !isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-white/10 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Icon et contenu principal */}
          <div className="flex items-start gap-3 flex-1">
            <div className="text-cyan-400 mt-1 flex-shrink-0">
              <Cookie size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-2">
                {translations.main.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {translations.main.description}{' '}
                <Link href="/legal/privacy" className="text-cyan-400 hover:text-cyan-300 underline">
                  {translations.main.learnMore}
                </Link>
              </p>

              {/* Options détaillées */}
              {showDetails && (
                <div className="mt-4 space-y-3 bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium text-sm">
                          {translations.categories.necessary.title}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {translations.categories.necessary.description}
                        </div>
                      </div>
                      <div className="text-green-400 text-xs font-medium bg-green-400/20 px-2 py-1 rounded">
                        {translations.categories.necessary.status}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium text-sm">
                          {translations.categories.analytics.title}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {translations.categories.analytics.description}
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium text-sm">
                          {translations.categories.marketing.title}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {translations.categories.marketing.description}
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {!showDetails && (
              <button
                onClick={handleCustomize}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium px-4 py-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm"
              >
                <Settings size={16} />
                {translations.actions.customize}
              </button>
            )}

            <button
              onClick={handleAcceptNecessary}
              className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-xl transition-colors text-sm"
            >
              {translations.actions.acceptNecessary}
            </button>

            <button
              onClick={handleAcceptAll}
              className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-300 shadow-xl text-sm"
            >
              {translations.actions.acceptAll}
            </button>
          </div>
        </div>

        {/* Bouton fermer mobile */}
        {showDetails && (
          <button
            onClick={() => setShowDetails(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors md:hidden"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
}