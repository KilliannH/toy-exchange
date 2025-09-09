// hooks/useVerifyEmailTranslations.ts
import { useTranslations } from 'next-intl';

export const useVerifyEmailTranslations = () => {
  const t = useTranslations('verifyEmail');
  
  return {
    // Helper functions pour les cas complexes
    getStatusTitle: (status: 'loading' | 'success' | 'error' | 'expired') => {
      switch (status) {
        case 'loading':
          return t('titles.verifying');
        case 'success':
          return t('titles.verified');
        case 'error':
          return t('titles.error');
        case 'expired':
          return t('titles.expired');
        default:
          return '';
      }
    },
    
    getStatusMessage: (status: 'loading' | 'success' | 'error' | 'expired', message: string) => {
      // Si on a un message personnalisé, on l'utilise, sinon on utilise le message par défaut
      if (message) return message;
      
      switch (status) {
        case 'loading':
          return t('messages.verifying');
        case 'success':
          return t('messages.success');
        case 'error':
          return t('messages.error');
        case 'expired':
          return t('messages.expired');
        default:
          return '';
      }
    },
    
    // Status titles
    titles: {
      verifying: t('titles.verifying'),
      verified: t('titles.verified'),
      error: t('titles.error'),
      expired: t('titles.expired')
    },
    
    // Status messages
    messages: {
      verifying: t('messages.verifying'),
      success: t('messages.success'),
      error: t('messages.error'),
      expired: t('messages.expired'),
      missingToken: t('messages.missingToken'),
      resendSuccess: t('messages.resendSuccess'),
      resendError: t('messages.resendError'),
      generalError: t('messages.generalError'),
      verificationError: t('messages.verificationError')
    },
    
    // Actions
    actions: {
      signIn: t('actions.signIn'),
      resendLink: t('actions.resendLink'),
      retryRegistration: t('actions.retryRegistration'),
      backToHome: t('actions.backToHome')
    },
    
    // Additional info
    info: {
      canSignIn: t('info.canSignIn'),
      verifyingEmail: t('info.verifyingEmail')
    }
  };
};