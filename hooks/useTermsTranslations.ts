// hooks/useTermsTranslations.ts
import { useTranslations } from 'next-intl';

export const useTermsTranslations = () => {
  const t = useTranslations('legal.terms');
  
  return {
    // Page metadata
    page: {
      title: t('page.title'),
      subtitle: t('page.subtitle'),
      lastUpdate: t('page.lastUpdate'),
      backToHome: t('page.backToHome')
    },
    
    // Terms sections
    sections: {
      purpose: {
        title: t('sections.purpose.title'),
        content: t('sections.purpose.content')
      },
      accessRegistration: {
        title: t('sections.accessRegistration.title'),
        content: t('sections.accessRegistration.content')
      },
      serviceOperation: {
        title: t('sections.serviceOperation.title'),
        content: t('sections.serviceOperation.content')
      },
      userCommitments: {
        title: t('sections.userCommitments.title'),
        content: t('sections.userCommitments.content')
      },
      platformResponsibility: {
        title: t('sections.platformResponsibility.title'),
        content: t('sections.platformResponsibility.content')
      },
      points: {
        title: t('sections.points.title'),
        content: t('sections.points.content')
      },
      accountSuspension: {
        title: t('sections.accountSuspension.title'),
        content: t('sections.accountSuspension.content')
      },
      applicableLaw: {
        title: t('sections.applicableLaw.title'),
        content: t('sections.applicableLaw.content')
      }
    },
    
    // Language switcher
    language: {
      french: t('language.french'),
      english: t('language.english')
    }
  };
};