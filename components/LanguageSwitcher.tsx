"use client";

import { useTransition } from "react";
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe, Check, Loader2 } from "lucide-react";

const languages = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇺🇸" }
];

export default function LanguageSwitcher() {
  const [pending, startTransition] = useTransition();
  const currentLocale = useLocale();

  async function switchLocale(locale: string) {
    try {
      // Appeler l'endpoint qui set le cookie
      await fetch(`/api/set-locale?locale=${locale}`, { method: "POST" });
      
      startTransition(() => {
        // Rechargement simple de la page pour prendre en compte la nouvelle locale
        window.location.reload();
      });
    } catch (error) {
      console.error('Error when loading locale:', error);
    }
  }

  return (
    <div className="relative group">
      {/* Bouton principal */}
      <button 
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all duration-300 disabled:opacity-50"
        disabled={pending}
      >
        {pending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Globe size={16} />
        )}
        <span className="text-sm font-medium">
          {languages.find(lang => lang.code === currentLocale)?.flag}{" "}
          {languages.find(lang => lang.code === currentLocale)?.name}
        </span>
      </button>
      
      {/* Menu déroulant */}
      <div className="absolute top-full right-0 mt-2 py-2 bg-black/90 backdrop-blur-lg border border-white/20 rounded-xl min-w-[150px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => switchLocale(lang.code)}
            disabled={pending}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors duration-200 flex items-center justify-between disabled:opacity-50 ${
              currentLocale === lang.code ? 'text-cyan-400 bg-white/5' : 'text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
            {currentLocale === lang.code && (
              <Check size={14} className="text-cyan-400" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}