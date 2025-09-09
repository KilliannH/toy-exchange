// hooks/usePointsSuccessTranslations.ts
import { useTranslations } from 'next-intl';

export const usePointsSuccessTranslations = () => {
  const t = useTranslations('pointsSuccess');
  
  return {
    // Helper functions pour les cas complexes
    getPointsAdded: (points: number) => {
      return t('details.pointsAdded', { points });
    },
    
    getAmountPaid: (amount: string | number) => {
      return t('details.amountPaid', { amount });
    },
    
    getTotalPoints: (totalPoints: string | number) => {
      return t('details.totalPoints', { totalPoints });
    },
    
    getTransactionId: (transactionId: string) => {
      return t('details.transactionId', { transactionId: transactionId.slice(-8) });
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
    
    // Details section
    details: {
      pointsAddedLabel: t('details.pointsAddedLabel'),
      amountPaidLabel: t('details.amountPaidLabel'),
      totalPointsLabel: t('details.totalPointsLabel'),
      transactionIdLabel: t('details.transactionIdLabel'),
      notAvailable: t('details.notAvailable')
    },
    
    // Action buttons
    buttons: {
      discoverToys: t('buttons.discoverToys'),
      backToDashboard: t('buttons.backToDashboard')
    },
    
    // Footer
    footer: {
      receiptSent: t('footer.receiptSent'),
      securedByStripe: t('footer.securedByStripe')
    }
  };
};