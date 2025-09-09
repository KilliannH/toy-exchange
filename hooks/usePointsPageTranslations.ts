// hooks/usePointsPageTranslations.ts
import { useTranslations } from 'next-intl';

export const usePointsPageTranslations = () => {
  const t = useTranslations('pointsPage');
  
  return {
    // Helper functions pour les cas complexes
    getCurrentPoints: (points: number) => {
      return t('header.currentPoints', { points });
    },
    
    getWelcomeMessage: (userName?: string) => {
      return t('header.welcomeMessage', { 
        userName: userName || t('header.defaultMember') 
      });
    },
    
    getPointsAmount: (points: number) => {
      return t('packs.pointsAmount', { points });
    },
    
    getPrice: (price: number) => {
      return t('packs.price', { price });
    },
    
    getValueRatio: (ratio: number) => {
      return t('packs.valueRatio', { ratio: ratio.toFixed(1) });
    },
    
    getPurchaseError: (error: string) => {
      return t('errors.purchaseError', { error });
    },
    
    // Navigation
    navigation: {
      backToDashboard: t('navigation.backToDashboard')
    },
    
    // Header
    header: {
      title: t('header.title'),
      subtitle: t('header.subtitle'),
      availablePoints: t('header.availablePoints'),
      defaultMember: t('header.defaultMember')
    },
    
    // Packs section
    packs: {
      choosePackTitle: t('packs.choosePackTitle'),
      starter: t('packs.starter'),
      popular: t('packs.popular'),
      premium: t('packs.premium'),
      popularBadge: t('packs.popularBadge')
    },
    
    // Pack benefits
    benefits: {
      instantPoints: t('benefits.instantPoints'),
      premiumAccess: t('benefits.premiumAccess'),
      valuePerEuro: t('benefits.valuePerEuro')
    },
    
    // Purchase button
    purchase: {
      buyNow: t('purchase.buyNow'),
      loading: t('purchase.loading')
    },
    
    // Security section
    security: {
      title: t('security.title'),
      stripeTitle: t('security.stripeTitle'),
      stripeDescription: t('security.stripeDescription'),
      instantTitle: t('security.instantTitle'),
      instantDescription: t('security.instantDescription'),
      guaranteeTitle: t('security.guaranteeTitle'),
      guaranteeDescription: t('security.guaranteeDescription')
    },
    
    // Errors
    errors: {
      stripeNotInitialized: t('errors.stripeNotInitialized'),
      generalPurchaseError: t('errors.generalPurchaseError')
    }
  };
};