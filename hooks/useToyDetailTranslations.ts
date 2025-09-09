// hooks/useToyDetailTranslations.ts
import { useTranslations } from 'next-intl';

export const useToyDetailTranslations = () => {
  const t = useTranslations('toyDetail');
  
  return {
    // Helper functions pour les cas complexes
    getStatusLabel: (status: string) => {
      return t(`status.${status}`, { defaultValue: status });
    },
    
    getModeLabel: (mode: string) => {
      return t(`modes.${mode}`, { defaultValue: mode });
    },
    
    getConditionLabel: (condition: string) => {
      return t(`conditions.${condition}`, { defaultValue: condition });
    },
    
    getContactTitle: (name?: string) => {
      return t('messaging.contactTitle', { 
        name: name || t('messaging.contactOwner') 
      });
    },
    
    getSendError: (error: string) => {
      return t('messaging.sendError', { error });
    },
    
    getReportingError: (error: string) => {
      return t('reporting.sendError', { error });
    },

    getReportReason: (reason: string) => {
      return t(`reporting.reasons.${reason}`, { defaultValue: reason });
    },
    
    // Navigation
    backToGallery: t('navigation.backToGallery'),
    
    // Loading & errors
    unboxingTreasure: t('loading.unboxingTreasure'),
    toyNotFound: t('error.toyNotFound'),
    treasureDisappeared: t('error.treasureDisappeared'),
    back: t('error.back'),
    
    // Details
    recommendedAge: t('details.recommendedAge'),
    condition: t('details.condition'),
    years: t('details.years'),
    pointsCost: t('details.pointsCost'),
    offeredBy: t('details.offeredBy'),
    anonymousUser: t('details.anonymousUser'),
    viewProfile: t('details.viewProfile'),
    
    // Actions
    contactOwner: t('actions.contactOwner'),
    hideContact: t('actions.hideContact'),
    registerToContact: t('actions.registerToContact'),
    share: t('actions.share'),
    report: t('actions.report'),
    
    // Favorites
    favorites: {
      loginRequired: t('favorites.loginRequired'),
      addedToFavorites: t('favorites.addedToFavorites'),
      removedFromFavorites: t('favorites.removedFromFavorites'),
      updateError: t('favorites.updateError'),
      networkError: t('favorites.networkError')
    },
    
    // Messaging
    messaging: {
      loginRequired: t('messaging.loginRequired'),
      emptyMessage: t('messaging.emptyMessage'),
      messageSent: t('messaging.messageSent'),
      unexpectedError: t('messaging.unexpectedError'),
      contactSubtitle: t('messaging.contactSubtitle'),
      messagePlaceholder: t('messaging.messagePlaceholder'),
      cancel: t('messaging.cancel'),
      sendMessage: t('messaging.sendMessage'),
      sending: t('messaging.sending')
    },
    
    // Exchange
    exchange: {
      proposeExchange: t('exchange.proposeExchange'),
      loadingToys: t('exchange.loadingToys'),
      noAvailableToys: t('exchange.noAvailableToys'),
      chooseToy: t('exchange.chooseToy'),
      proposalSent: t('exchange.proposalSent'),
      optionalMessage: t('exchange.optionalMessage'),
      sendProposal: t('exchange.sendProposal')
    },
    
    // Sharing
    sharing: {
      shareTitle: t('sharing.shareTitle'),
      shareSubtitle: t('sharing.shareSubtitle'),
      shareOnFacebook: t('sharing.shareOnFacebook'),
      copyLink: t('sharing.copyLink'),
      directLink: t('sharing.directLink'),
      linkCopied: t('sharing.linkCopied')
    },
    
    // Reporting
    reporting: {
      reportTitle: t('reporting.reportTitle'),
      reportSubtitle: t('reporting.reportSubtitle'),
      reportReason: t('reporting.reportReason'),
      describeProblem: t('reporting.describeProblem'),
      problemPlaceholder: t('reporting.problemPlaceholder'),
      confidentialReport: t('reporting.confidentialReport'),
      sentTo: t('reporting.sentTo'),
      selectReason: t('reporting.selectReason'),
      describeProblemRequired: t('reporting.describeProblemRequired'),
      reportSent: t('reporting.reportSent'),
      reportError: t('reporting.reportError'),
      cancel: t('reporting.cancel'),
      send: t('reporting.send')
    },
    
    // Similar toys
    similarToys: {
      title: t('similarToys.title'),
      viewAllSimilar: t('similarToys.viewAllSimilar')
    }
  };
};