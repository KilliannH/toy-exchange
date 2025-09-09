// hooks/useProfilePageTranslations.ts
import { useTranslations } from 'next-intl';

export const useProfilePageTranslations = () => {
  const t = useTranslations('profilePage');
  
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
    
    // Error page
    error: {
      title: t('error.title'),
      subtitle: t('error.subtitle'),
      description: t('error.description')
    },
    
    // Stats labels
    stats: {
      toysLabel: t('stats.toysLabel'),
      exchangesLabel: t('stats.exchangesLabel'),
      donationsLabel: t('stats.donationsLabel'),
      ratingLabel: t('stats.ratingLabel'),
      memberSinceLabel: t('stats.memberSinceLabel'),
      newMember: t('stats.newMember')
    }
  };
};