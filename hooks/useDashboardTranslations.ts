// hooks/useDashboardTranslations.ts
import { useTranslations } from 'next-intl';

export const useDashboardTranslations = () => {
  const t = useTranslations('dashboard');
  
  return {
    // Helper functions pour les cas complexes
    getSectionTitle: (section: string, count: number) => {
      return t(`${section}.sectionTitle`, { count });
    },
    
    getConditionLabel: (condition: string) => {
      return t(`conditions.${condition}`, { defaultValue: condition });
    },
    
    getExchangeStatus: (status: string) => {
      return t(`exchanges.status.${status}`, { defaultValue: status });
    },
    
    getOfferedBy: (name: string) => {
      return t('favorites.offeredBy', { name });
    },
    
    getProposedBy: (name: string) => {
      return t('exchanges.proposedBy', { name });
    },
    
    getClickAction: (section: string, isPoints: boolean = false) => {
      if (isPoints) {
        return t('stats.clickToBuyPoints');
      }
      return section === 'messages' 
        ? t('stats.clickToView', { section: section.toLowerCase() })
        : t('stats.clickToGoTo', { section: section.toLowerCase() });
    },
    
    formatTimeAgo: (date: string | Date) => {
      const now = new Date();
      const time = new Date(date);
      const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));

      if (diffInHours < 1) return t('timeAgo.fewMinutes');
      if (diffInHours < 24) return t('timeAgo.hoursAgo', { hours: diffInHours });
      if (diffInHours < 48) return t('timeAgo.yesterday');
      const diffInDays = Math.floor(diffInHours / 24);
      return t('timeAgo.daysAgo', { days: diffInDays });
    },
    
    // Page principale
    pageTitle: t('pageTitle'),
    pageSubtitle: t('pageSubtitle'),
    
    // Loading et erreurs
    loadingTreasures: t('loading.loadingTreasures'),
    errorTitle: t('error.errorTitle'),
    dataLoadError: t('error.dataLoadError'),
    
    // Stats cards
    stats: {
      myToys: t('stats.myToys'),
      activeExchanges: t('stats.activeExchanges'),
      messages: t('stats.messages'),
      averageRating: t('stats.averageRating'),
      myPoints: t('stats.myPoints')
    },
    
    // Section Mes jouets
    myToys: {
      addToy: t('myToys.addToy'),
      emptyTitle: t('myToys.emptyTitle'),
      emptyDescription: t('myToys.emptyDescription'),
      addFirstToy: t('myToys.addFirstToy'),
      viewDetails: t('myToys.viewDetails'),
      edit: t('myToys.edit'),
      delete: t('myToys.delete'),
      confirmDelete: t('myToys.confirmDelete'),
      deleteSuccess: t('myToys.deleteSuccess'),
      deleteError: t('myToys.deleteError'),
      years: t('myToys.years')
    },
    
    // Section Favoris
    favorites: {
      loading: t('favorites.loading'),
      error: t('favorites.error'),
      emptyTitle: t('favorites.emptyTitle'),
      emptyDescription: t('favorites.emptyDescription'),
      discoverToys: t('favorites.discoverToys'),
      viewDetails: t('favorites.viewDetails'),
      toy: t('favorites.toy'),
      member: t('favorites.member')
    },
    
    // Section Échanges
    exchanges: {
      loading: t('exchanges.loading'),
      error: t('exchanges.error'),
      empty: t('exchanges.empty'),
      openConversation: t('exchanges.openConversation')
    },
    
    // Reviews modal
    reviews: {
      empty: t('reviews.empty'),
      user: t('reviews.user'),
      getModalTitle: (count: number) => t('reviews.modalTitle', { count })
    }
  };
};