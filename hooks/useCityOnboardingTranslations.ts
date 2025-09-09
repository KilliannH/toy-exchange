// hooks/useCityOnboardingTranslations.ts
import { useTranslations } from 'next-intl';

export const useCityOnboardingTranslations = () => {
  const t = useTranslations('cityOnboarding');
  
  return {
    // Helper functions pour les cas complexes
    getWelcomeMessage: (userName?: string) => {
      return t('header.welcomeMessage', { 
        userName: userName || t('header.defaultUser') 
      });
    },
    
    getLocationError: (error: string) => {
      return t('errors.locationError', { error });
    },
    
    getSaveError: (error: string) => {
      return t('errors.saveError', { error });
    },
    
    // Loading
    loading: {
      general: t('loading.general'),
      saving: t('loading.saving')
    },
    
    // Header
    header: {
      lastStep: t('header.lastStep'),
      hello: t('header.hello'),
      cityPrompt: t('header.cityPrompt')
    },
    
    // Form
    form: {
      cityLabel: t('form.cityLabel'),
      cityPlaceholder: t('form.cityPlaceholder'),
      noResults: t('form.noResults'),
      submitButton: t('form.submitButton'),
      submitting: t('form.submitting')
    },
    
    // Info box
    info: {
      whyCity: t('info.whyCity'),
      whyCityDescription: t('info.whyCityDescription')
    },
    
    // Footer
    footer: {
      dataSecurityMessage: t('footer.dataSecurityMessage')
    },
    
    // Success/Error messages
    messages: {
      locationSaved: t('messages.locationSaved'),
      networkError: t('messages.networkError'),
      geolocationError: t('messages.geolocationError')
    },
    
    // Errors
    errors: {
      generalError: t('errors.generalError')
    }
  };
};