// hooks/useProfileClientTranslations.ts
import { useTranslations } from 'next-intl';

export const useProfileClientTranslations = () => {
  const t = useTranslations('profileClient');
  
  return {
    // Helper functions pour les cas complexes
    getTimeAgo: (diffInHours: number) => {
      if (diffInHours < 1) return t('activity.timeAgo.fewMinutes');
      if (diffInHours < 24) return t('activity.timeAgo.hours', { hours: diffInHours });
      if (diffInHours < 48) return t('activity.timeAgo.yesterday');
      const diffInDays = Math.floor(diffInHours / 24);
      return t('activity.timeAgo.days', { days: diffInDays });
    },
    
    getUserLevel: (exchangesCount: number) => {
      return exchangesCount >= 20 ? t('achievement.levelAmbassador') : t('achievement.levelExplorer');
    },
    
    getNextLevelTarget: (exchangesCount: number) => {
      return exchangesCount >= 20 ? 50 : 20;
    },
    
    getNextLevelProgress: (exchangesCount: number) => {
      const target = exchangesCount >= 20 ? 50 : 20;
      return t('achievement.exchangesProgress', { current: exchangesCount, target });
    },
    
    getNextLevelRemaining: (exchangesCount: number) => {
      const remaining = exchangesCount >= 20 
        ? Math.max(0, 50 - exchangesCount)
        : Math.max(0, 20 - exchangesCount);
      const nextLevel = exchangesCount >= 20 ? t('achievement.levelExpert') : t('achievement.levelAmbassador');
      return t('achievement.remainingForNext', { remaining, nextLevel });
    },
    
    getBadgesProgress: (earned: number, total: number) => {
      return t('badges.progress', { earned, total });
    },
    
    getActivityType: (type: string) => {
      switch (type) {
        case 'post':
          return t('activity.types.newToy');
        case 'exchange':
          return t('activity.types.exchange');
        case 'message':
          return t('activity.types.message');
        default:
          return type;
      }
    },
    
    getDeleteConfirmationItems: (stats: any, earnedBadges: number) => {
      return [
        t('deleteModal.items.toys', { count: stats.toysCount }),
        t('deleteModal.items.exchanges', { count: stats.exchangesCount }),
        t('deleteModal.items.badges', { count: earnedBadges }),
        t('deleteModal.items.personalData')
      ];
    },
    
    // Header
    header: {
      title: t('header.title'),
      subtitle: t('header.subtitle')
    },
    
    // Personal info section
    personalInfo: {
      title: t('personalInfo.title'),
      editButton: t('personalInfo.editButton'),
      fullName: t('personalInfo.fullName'),
      email: t('personalInfo.email'),
      city: t('personalInfo.city'),
      notProvided: t('personalInfo.notProvided')
    },
    
    // Preferences section
    preferences: {
      title: t('preferences.title'),
      searchRadius: t('preferences.searchRadius'),
      custom: t('preferences.custom'),
      defaultValue: t('preferences.defaultValue')
    },
    
    // Danger zone
    dangerZone: {
      title: t('dangerZone.title'),
      deleteAccountTitle: t('dangerZone.deleteAccountTitle'),
      deleteDescription: t('dangerZone.deleteDescription'),
      irreversible: t('dangerZone.irreversible'),
      deleteButton: t('dangerZone.deleteButton')
    },
    
    // Stats
    stats: {
      title: t('stats.title'),
      toysPosted: t('stats.toysPosted'),
      exchangesCompleted: t('stats.exchangesCompleted'),
      averageRating: t('stats.averageRating'),
      memberSince: t('stats.memberSince'),
      notAvailable: t('stats.notAvailable')
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
    },
    
    // Quick actions
    quickActions: {
      title: t('quickActions.title'),
      browseToys: t('quickActions.browseToys'),
      addToy: t('quickActions.addToy'),
      dashboard: t('quickActions.dashboard')
    },
    
    // Achievement banner
    achievement: {
      title: t('achievement.title'),
      subtitle: t('achievement.subtitle'),
      levelLabel: t('achievement.levelLabel')
    },
    
    // Activity section
    activity: {
      title: t('activity.title'),
      loading: t('activity.loading'),
      noActivity: t('activity.noActivity'),
      startByAdding: t('activity.startByAdding'),
      viewAll: t('activity.viewAll'),
      addToy: t('activity.addToy')
    },
    
    // Delete modal
    deleteModal: {
      title: t('deleteModal.title'),
      subtitle: t('deleteModal.subtitle'),
      aboutToDelete: t('deleteModal.aboutToDelete'),
      confirmInstruction: t('deleteModal.confirmInstruction'),
      deleteWord: t('deleteModal.deleteWord'),
      placeholder: t('deleteModal.placeholder'),
      cancel: t('deleteModal.cancel'),
      deleteButton: t('deleteModal.deleteButton'),
      deleting: t('deleteModal.deleting'),
      deleteError: t('deleteModal.deleteError')
    }
  };
};