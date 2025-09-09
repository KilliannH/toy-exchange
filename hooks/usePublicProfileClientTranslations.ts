// hooks/usePublicProfileClientTranslations.ts
import { useTranslations } from 'next-intl';

export const usePublicProfileClientTranslations = () => {
  const t = useTranslations('publicProfileClient');
  
  return {
    // Helper functions pour les cas complexes
    getTimeAgo: (diffInHours: number) => {
      if (diffInHours < 1) return t('timeAgo.fewMinutes');
      if (diffInHours < 24) return t('timeAgo.hours', { hours: Math.floor(diffInHours) });
      if (diffInHours < 48) return t('timeAgo.yesterday');
      const diffInDays = Math.floor(diffInHours / 24);
      return t('timeAgo.days', { days: diffInDays });
    },
    
    getMemberSince: (memberSince: string) => {
      return t('header.memberSince', { duration: memberSince });
    },
    
    getBadgesProgress: (earned: number, total: number) => {
      return t('badges.progress', { earned, total });
    },
    
    getRecentReviewsCount: (count: number) => {
      return t('reviews.recentReviewsCount', { count });
    },
    
    getToyModeLabel: (mode: string) => {
      switch (mode) {
        case 'DON':
          return t('toys.modes.donation');
        case 'EXCHANGE':
          return t('toys.modes.exchange');
        case 'POINTS':
          return t('toys.modes.points');
        default:
          return mode;
      }
    },
    
    getUserDisplayName: (name?: string) => {
      return name || t('header.defaultUser');
    },
    
    getReviewerName: (name?: string) => {
      return name || t('reviews.defaultUser');
    },
    
    // Navigation
    navigation: {
      backToToys: t('navigation.backToToys')
    },
    
    // Header
    header: {
      defaultUser: t('header.defaultUser'),
      memberSinceLabel: t('header.memberSinceLabel')
    },
    
    // Stats section
    stats: {
      title: t('stats.title'),
      toys: t('stats.toys'),
      exchanges: t('stats.exchanges'),
      donations: t('stats.donations'),
      rating: t('stats.rating'),
      notAvailable: t('stats.notAvailable')
    },
    
    // Toys section
    toys: {
      title: t('toys.title'),
      noToys: t('toys.noToys'),
      noToysDesc: t('toys.noToysDesc'),
      modes: {
        donation: t('toys.modes.donation'),
        exchange: t('toys.modes.exchange'),
        points: t('toys.modes.points')
      }
    },
    
    // Reviews section
    reviews: {
      title: t('reviews.title'),
      defaultUser: t('reviews.defaultUser')
    },
    
    // Badges
    badges: {
      title: t('badges.title'),
      firstExchange: t('badges.firstExchange'),
      firstExchangeDesc: t('badges.firstExchangeDesc'),
      generous: t('badges.generous'),
      generousDesc: t('badges.generousDesc'),
      collector: t('badges.collector'),
      collectorDesc: t('badges.collectorDesc'),
      ambassador: t('badges.ambassador'),
      ambassadorDesc: t('badges.ambassadorDesc'),
      expert: t('badges.expert'),
      expertDesc: t('badges.expertDesc'),
      veteran: t('badges.veteran'),
      veteranDesc: t('badges.veteranDesc')
    }
  };
};