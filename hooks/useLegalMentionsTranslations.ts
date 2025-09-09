// hooks/useLegalMentionsTranslations.ts
import { useTranslations } from 'next-intl';

export const useLegalMentionsTranslations = () => {
  const t = useTranslations('legal.mentions');
  
  return {
    // Page metadata
    page: {
      title: t('page.title'),
      subtitle: t('page.subtitle'),
      lastUpdate: t('page.lastUpdate'),
      backToHome: t('page.backToHome')
    },
    
    // Company information
    company: {
      siteName: t('company.siteName'),
      editor: t('company.editor'),
      address: t('company.address'),
      email: t('company.email'),
      publicationDirector: t('company.publicationDirector')
    },
    
    // Hosting information
    hosting: {
      host: t('hosting.host'),
      hostAddress: t('hosting.hostAddress')
    },
    
    // Legal sections
    sections: {
      intellectualProperty: {
        title: t('sections.intellectualProperty.title'),
        content: t('sections.intellectualProperty.content')
      },
      responsibility: {
        title: t('sections.responsibility.title'),
        content: t('sections.responsibility.content')
      }
    },
    
    // Language switcher
    language: {
      french: t('language.french'),
      english: t('language.english')
    }
  };
};