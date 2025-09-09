// hooks/usePointsCancelTranslations.ts
import { useTranslations } from 'next-intl';

export const usePointsCancelTranslations = () => {
  const t = useTranslations('pointsCancel');
  
  return {
    // Helper functions pour les cas complexes
    getSessionId: (sessionId: string) => {
      return t('info.sessionId', { sessionId: sessionId.slice(-8) });
    },
    
    // Loading
    loading: {
      verification: t('loading.verification'),
      general: t('loading.general')
    },
    
    // Header
    header: {
      title: t('header.title'),
      subtitle: t('header.subtitle')
    },
    
    // Info section
    info: {
      transactionCancelled: t('info.transactionCancelled'),
      retryAnytime: t('info.retryAnytime'),
      status: t('info.status'),
      cancelled: t('info.cancelled'),
      amountCharged: t('info.amountCharged'),
      zeroAmount: t('info.zeroAmount'),
      sessionIdLabel: t('info.sessionIdLabel')
    },
    
    // Reasons section
    reasons: {
      title: t('reasons.title'),
      closedPage: t('reasons.closedPage'),
      clickedCancel: t('reasons.clickedCancel'),
      timeoutExpired: t('reasons.timeoutExpired'),
      technicalProblem: t('reasons.technicalProblem')
    },
    
    // Action buttons
    buttons: {
      retryPurchase: t('buttons.retryPurchase'),
      viewFreeToys: t('buttons.viewFreeToys'),
      backToDashboard: t('buttons.backToDashboard')
    },
    
    // Reassurance
    reassurance: {
      noCharge: t('reassurance.noCharge'),
      securedByStripe: t('reassurance.securedByStripe')
    }
  };
};