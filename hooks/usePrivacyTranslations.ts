// hooks/usePrivacyTranslations.ts
import { useTranslations } from 'next-intl';

export const usePrivacyTranslations = () => {
  const t = useTranslations('legal.privacy');
  
  return {
    // Page metadata
    page: {
      title: t('page.title'),
      subtitle: t('page.subtitle'),
      lastUpdate: t('page.lastUpdate'),
      backToHome: t('page.backToHome')
    },
    
    // Privacy policy sections
    sections: {
      dataCollected: {
        title: t('sections.dataCollected.title'),
        content: t('sections.dataCollected.content')
      },
      purposes: {
        title: t('sections.purposes.title'),
        content: t('sections.purposes.content')
      },
      legalBasis: {
        title: t('sections.legalBasis.title'),
        content: t('sections.legalBasis.content')
      },
      recipients: {
        title: t('sections.recipients.title'),
        content: t('sections.recipients.content')
      },
      retention: {
        title: t('sections.retention.title'),
        content: t('sections.retention.content')
      },
      rights: {
        title: t('sections.rights.title'),
        content: t('sections.rights.content')
      },
      cookies: {
        title: t('sections.cookies.title'),
        content: t('sections.cookies.content')
      }
    },
    
    // Language switcher
    language: {
      french: t('language.french'),
      english: t('language.english')
    }
  };
};