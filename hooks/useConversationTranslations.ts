// hooks/useConversationTranslations.ts
import { useTranslations } from 'next-intl';

export const useConversationTranslations = () => {
  const t = useTranslations('conversation');
  
  return {
    // Helper functions pour les cas complexes
    getAboutToy: (toyTitle: string) => {
      return t('header.aboutToy', { toyTitle });
    },
    
    getExchangeError: (error: string) => {
      return t('exchange.exchangeError', { error });
    },
    
    getDonationError: (error: string) => {
      return t('donation.donationError', { error });
    },
    
    getPurchaseError: (error: string) => {
      return t('points.purchaseError', { error });
    },
    
    getConfirmPurchase: (points: number) => {
      return t('points.confirmPurchase', { points });
    },
    
    getPurchaseConfirmed: (points: number) => {
      return t('points.purchaseConfirmed', { points });
    },
    
    getConfirmPrompt: (points: number) => {
      return t('points.confirmPrompt', { points });
    },
    
    getSendError: (error: string) => {
      return t('messages.sendError', { error });
    },
    
    getReviewTitle: (partnerName?: string) => {
      return t('reviews.reviewTitle', { 
        partnerName: partnerName || t('reviews.yourPartner') 
      });
    },
    
    getCompleteMessage: (mode: string) => {
      switch (mode) {
        case 'DON':
          return t('messages.donationCompleteMessage');
        case 'EXCHANGE':
          return t('messages.exchangeCompleteMessage');
        case 'POINTS':
          return t('messages.pointsCompleteMessage');
        default:
          return t('messages.exchangeCompleteMessage');
      }
    },
    
    // Loading et erreurs
    loadingConversation: t('loading.loadingConversation'),
    loadingError: t('error.loadingError'),
    cannotLoadConversation: t('error.cannotLoadConversation'),
    
    // Header
    unknownToy: t('header.unknownToy'),
    
    // Exchange
    exchange: {
      confirmExchange: t('exchange.confirmExchange'),
      confirm: t('exchange.confirm'),
      youConfirmed: t('exchange.youConfirmed'),
      exchangeConfirmed: t('exchange.exchangeConfirmed'),
      exchangeSuccess: t('exchange.exchangeSuccess'),
      confirmExchangePrompt: t('exchange.confirmExchangePrompt')
    },
    
    // Donation
    donation: {
      confirmDonation: t('donation.confirmDonation'),
      donationConfirmed: t('donation.donationConfirmed'),
      donationSuccess: t('donation.donationSuccess'),
      networkError: t('donation.networkError'),
      confirmPrompt: t('donation.confirmPrompt')
    },
    
    // Points
    points: {
      purchaseSuccess: t('points.purchaseSuccess')
    },
    
    // Messages
    messages: {
      you: t('messages.you'),
      writeMessage: t('messages.writeMessage'),
      networkError: t('messages.networkError')
    },
    
    // Reviews
    reviews: {
      ratingRequired: t('reviews.ratingRequired'),
      commentPlaceholder: t('reviews.commentPlaceholder'),
      submitReview: t('reviews.submitReview'),
      submitting: t('reviews.submitting'),
      reviewSuccess: t('reviews.reviewSuccess')
    }
  };
};