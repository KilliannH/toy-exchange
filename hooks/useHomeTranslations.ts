// hooks/useHomeTranslations.ts
import { useTranslations } from 'next-intl';

export const useHomeTranslations = () => {
  const t = useTranslations('home');
  
  return {
    // Hero section
    hero: {
      title: t('hero.title'),
      subtitle: t('hero.subtitle'),
      tagline: t('hero.tagline'),
      startAdventure: t('hero.startAdventure'),
      discoverToys: t('hero.discoverToys')
    },
    
    // Features section
    features: {
      title: t('features.title'),
      planet: {
        title: t('features.planet.title'),
        description: t('features.planet.description')
      },
      budget: {
        title: t('features.budget.title'),
        description: t('features.budget.description')
      },
      network: {
        title: t('features.network.title'),
        description: t('features.network.description')
      }
    },
    
    // How it works section
    howItWorks: {
      title: t('howItWorks.title'),
      publish: {
        title: t('howItWorks.publish.title'),
        description: t('howItWorks.publish.description')
      },
      negotiate: {
        title: t('howItWorks.negotiate.title'),
        description: t('howItWorks.negotiate.description')
      },
      exchange: {
        title: t('howItWorks.exchange.title'),
        description: t('howItWorks.exchange.description')
      }
    },
    
    // Final CTA section
    cta: {
      title: t('cta.title'),
      subtitle: t('cta.subtitle'),
      button: t('cta.button')
    },
    
    // Footer
    footer: {
      description: t('footer.description'),
      legal: {
        title: t('footer.legal.title'),
        privacy: t('footer.legal.privacy'),
        terms: t('footer.legal.terms'),
        mentions: t('footer.legal.mentions')
      },
      copyright: t('footer.copyright')
    }
  };
};