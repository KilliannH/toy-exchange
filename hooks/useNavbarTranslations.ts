// hooks/useNavbarTranslations.ts
import { useTranslations } from 'next-intl';

export const useNavbarTranslations = () => {
  const t = useTranslations('navigation');
  
  return {
    // Logo
    logo: {
      alt: t('logo.alt')
    },
    
    // Navigation links
    nav: {
      toys: t('nav.toys'),
      post: t('nav.post'),
      postToy: t('nav.postToy'),
      messages: t('nav.messages'),
      dashboard: t('nav.dashboard')
    },
    
    // User actions
    user: {
      profile: t('user.profile'),
      signOut: t('user.signOut'),
      signIn: t('user.signIn'),
      register: t('user.register'),
      viewProfile: t('user.viewProfile')
    },
    
    // Tooltips and accessibility
    accessibility: {
      signOutTooltip: t('accessibility.signOutTooltip'),
      avatarAlt: t('accessibility.avatarAlt')
    }
  };
};