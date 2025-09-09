// hooks/usePublicProfileTranslations.ts
import { useTranslations } from 'next-intl';

export const usePublicProfileTranslations = () => {
  const t = useTranslations('publicProfile');
  
  return {
    // Helper functions pour les cas complexes
    getMembershipDuration: (monthsSinceJoin: number) => {
      return monthsSinceJoin === 0 
        ? t('stats.memberSinceNew') 
        : t('stats.memberSinceMonths', { months: monthsSinceJoin });
    },
    
    getToysCount: (count: number) => {
      return t('stats.toysCount', { count });
    },
    
    getExchangesCount: (count: number) => {
      return t('stats.exchangesCount', { count });
    },
    
    getDonationsCount: (count: number) => {
      return t('stats.donationsCount', { count });
    },
    
    getAverageRating: (rating: number) => {
      return t('stats.averageRating', { rating: rating.toFixed(1) });
    },
    
    getReviewsCount: (count: number) => {
      return t('reviews.reviewsCount', { count });
    },
    
    getTimeAgo: (date: string) => {
      const now = new Date();
      const reviewDate = new Date(date);
      const diffInDays = Math.floor((now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) return t('reviews.timeAgo.today');
      if (diffInDays === 1) return t('reviews.timeAgo.yesterday');
      if (diffInDays < 7) return t('reviews.timeAgo.daysAgo', { days: diffInDays });
      if (diffInDays < 30) return t('reviews.timeAgo.weeksAgo', { weeks: Math.floor(diffInDays / 7) });
      return t('reviews.timeAgo.monthsAgo', { months: Math.floor(diffInDays / 30) });
    },
    
    getModeLabel: (mode: string) => {
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
    
    // Header
    header: {
      profileOf: t('header.profileOf'),
      memberSince: t('header.memberSince'),
      fromCity: t('header.fromCity')
    },
    
    // Navigation
    navigation: {
      backToSearch: t('navigation.backToSearch')
    },
    
    // Stats section
    stats: {
      title: t('stats.title'),
      toysPosted: t('stats.toysPosted'),
      donationsGiven: t('stats.donationsGiven'),
      exchangesCompleted: t('stats.exchangesCompleted'),
      averageRating: t('stats.averageRatingLabel'),
      memberSince: t('stats.memberSince'),
      notAvailable: t('stats.notAvailable'),
      newMember: t('stats.newMember')
    },
    
    // Toys section
    toys: {
      title: t('toys.title'),
      recentToys: t('toys.recentToys'),
      noToys: t('toys.noToys'),
      noToysDesc: t('toys.noToysDesc'),
      viewAllToys: t('toys.viewAllToys'),
      modes: {
        donation: t('toys.modes.donation'),
        exchange: t('toys.modes.exchange'),
        points: t('toys.modes.points')
      }
    },
    
    // Reviews section
    reviews: {
      title: t('reviews.title'),
      noReviews: t('reviews.noReviews'),
      noReviewsDesc: t('reviews.noReviewsDesc'),
      anonymous: t('reviews.anonymous'),
      starsRating: t('reviews.starsRating'),
      timeAgo: {
        today: t('reviews.timeAgo.today'),
        yesterday: t('reviews.timeAgo.yesterday'),
        daysAgo: t('reviews.timeAgo.daysAgo'),
        weeksAgo: t('reviews.timeAgo.weeksAgo'),
        monthsAgo: t('reviews.timeAgo.monthsAgo')
      }
    },
    
    // Actions
    actions: {
      contactUser: t('actions.contactUser'),
      viewToys: t('actions.viewToys'),
      reportUser: t('actions.reportUser')
    },
    
    // Trust indicators
    trust: {
      verifiedMember: t('trust.verifiedMember'),
      reliableMember: t('trust.reliableMember'),
      activeMember: t('trust.activeMember')
    }
  };
};