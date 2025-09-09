// hooks/useToysTranslations.ts
import { useTranslations } from 'next-intl';

export const useToysTranslations = () => {
  const t = useTranslations('toys');
  
  return {
    // Helper functions pour les cas complexes
    getPageSubtitle: (count: number) => {
      const plural = count !== 1 ? 's' : '';
      return t('pageSubtitle', { count, plural });
    },
    
    getResultsCount: (count: number, total: number) => {
      const plural = count !== 1 ? 's' : '';
      return `${t('results.count', { count, plural })} ${t('results.outOf', { total })}`;
    },
    
    getConditionLabel: (condition: string) => {
      return t(`conditions.${condition}`, { defaultValue: condition });
    },
    
    getModeLabel: (mode: string) => {
      return t(`modes.${mode}`, { defaultValue: mode });
    },
    
    getFilterLabel: (filter: string) => {
      return t(`filters.${filter}`, { defaultValue: filter });
    },
    
    getAgeRange: (min?: number, max?: number) => {
      return t('card.ageRange', { 
        min: min ?? '?', 
        max: max ?? '?' 
      });
    },
    
    // Accès direct aux traductions
    pageTitle: t('pageTitle'),
    searchPlaceholder: t('searchPlaceholder'),
    discoveryLoading: t('discoveryLoading'),
    noResults: t('results.noResults'),
    noResultsDescription: t('results.noResultsDescription'),
    viewDetails: t('card.viewDetails'),
    unknownCity: t('card.unknownCity'),
    endOfList: t('infiniteScroll.endOfList'),
    loadingFailed: t('errors.loadingFailed'),
    tryAgain: t('errors.tryAgain'),
    errorTitle: t('errors.errorTitle'),
    addToy: t('actions.addToy'),
    filteredByCity: t('geo.filteredByCity'),
    showAllToys: t('geo.showAllToys')
  };
};