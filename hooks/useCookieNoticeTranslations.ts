// hooks/useCookieNoticeTranslations.ts
import { useTranslations } from 'next-intl';

export const useCookieNoticeTranslations = () => {
  const t = useTranslations('cookie.notice');
  
  return {
    // Main content
    main: {
      title: t('main.title'),
      description: t('main.description'),
      learnMore: t('main.learnMore')
    },
    
    // Cookie categories
    categories: {
      necessary: {
        title: t('categories.necessary.title'),
        description: t('categories.necessary.description'),
        status: t('categories.necessary.status')
      },
      analytics: {
        title: t('categories.analytics.title'),
        description: t('categories.analytics.description')
      },
      marketing: {
        title: t('categories.marketing.title'),
        description: t('categories.marketing.description')
      }
    },
    
    // Action buttons
    actions: {
      customize: t('actions.customize'),
      acceptNecessary: t('actions.acceptNecessary'),
      acceptAll: t('actions.acceptAll')
    }
  };
};