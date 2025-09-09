// hooks/useMessagesTranslations.ts
import { useTranslations } from 'next-intl';

export const useMessagesTranslations = () => {
  const t = useTranslations('messages');
  
  return {
    // Page principale
    pageTitle: t('pageTitle'),
    
    // Loading
    loadingConversations: t('loading.loadingConversations'),
    
    // Erreurs
    error: {
      accessDenied: t('error.accessDenied'),
      loginRequired: t('error.loginRequired'),
      signIn: t('error.signIn'),
      oops: t('error.oops'),
      cannotLoadConversations: t('error.cannotLoadConversations'),
      tryAgain: t('error.tryAgain')
    },
    
    // État vide
    empty: {
      noConversations: t('empty.noConversations'),
      noMessagesYet: t('empty.noMessagesYet'),
      browseToys: t('empty.browseToys')
    },
    
    // Conversation
    conversation: {
      defaultTitle: t('conversation.defaultTitle')
    }
  };
};