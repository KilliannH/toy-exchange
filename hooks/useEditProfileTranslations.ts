// hooks/useEditProfileTranslations.ts
import { useTranslations } from 'next-intl';

export const useEditProfileTranslations = () => {
  const t = useTranslations('editProfile');
  
  return {
    // Helper functions pour les cas complexes
    getRadiusText: (radius: number) => {
      return t('form.radiusValue', { radius });
    },
    
    getZoneDescription: (radius: number) => {
      return t('preview.zoneDescription', { radius });
    },
    
    getNameInitial: (name?: string) => {
      return name?.charAt(0)?.toUpperCase() || "?";
    },
    
    // Loading
    loading: {
      profile: t('loading.profile'),
      saving: t('loading.saving')
    },
    
    // Navigation
    navigation: {
      backToProfile: t('navigation.backToProfile')
    },
    
    // Header
    header: {
      title: t('header.title'),
      subtitle: t('header.subtitle')
    },
    
    // Success message
    success: {
      profileUpdated: t('success.profileUpdated')
    },
    
    // Form fields
    form: {
      profilePhoto: t('form.profilePhoto'),
      fullName: t('form.fullName'),
      namePlaceholder: t('form.namePlaceholder'),
      city: t('form.city'),
      cityPlaceholder: t('form.cityPlaceholder'),
      noResults: t('form.noResults'),
      searchRadius: t('form.searchRadius'),
      kilometers: t('form.kilometers'),
      exchangeZone: t('form.exchangeZone'),
      proximity: t('form.proximity'),
      saveButton: t('form.saveButton')
    },
    
    // Preview section
    preview: {
      title: t('preview.title'),
      nameNotDefined: t('preview.nameNotDefined'),
      cityNotDefined: t('preview.cityNotDefined'),
      exchangeZoneTitle: t('preview.exchangeZoneTitle'),
      aroundYou: t('preview.aroundYou')
    },
    
    // Tips section
    tips: {
      title: t('tips.title'),
      visibleName: t('tips.visibleName'),
      visibleNameDesc: t('tips.visibleNameDesc'),
      preciseCity: t('tips.preciseCity'),
      preciseCityDesc: t('tips.preciseCityDesc'),
      optimalRadius: t('tips.optimalRadius'),
      optimalRadiusDesc: t('tips.optimalRadiusDesc')
    },
    
    // Privacy section
    privacy: {
      title: t('privacy.title'),
      description: t('privacy.description')
    },
    
    // Messages
    messages: {
      cityNotFound: t('messages.cityNotFound'),
      uploadError: t('messages.uploadError')
    },
    
    // Errors
    errors: {
      generalError: t('errors.generalError')
    }
  };
};