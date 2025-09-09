"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import locales from '../src/i18n/request';

const languageNames = {
  en: 'English',
  fr: 'Français'
};

const languageFlags = {
  en: '🇺🇸',
  fr: '🇫🇷'
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    // Remplacer la locale dans le pathname
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    
    router.push(newPath);
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all duration-300">
        <Globe size={16} />
        <span className="text-sm font-medium">
          {languageFlags[locale as keyof typeof languageFlags]} {languageNames[locale as keyof typeof languageNames]}
        </span>
      </button>
      
      <div className="absolute top-full right-0 mt-2 py-2 bg-black/90 backdrop-blur-lg border border-white/20 rounded-xl min-w-[150px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
        {locales.map((lang) => (
          <button
            key={lang}
            onClick={() => handleLocaleChange(lang)}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors duration-200 flex items-center gap-3 ${
              locale === lang ? 'text-cyan-400 bg-white/5' : 'text-white'
            }`}
          >
            <span>{languageFlags[lang]}</span>
            <span>{languageNames[lang]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}