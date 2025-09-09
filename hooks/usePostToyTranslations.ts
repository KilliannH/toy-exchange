// hooks/usePostToyTranslations.ts
import { useTranslations } from 'next-intl';

export const usePostToyTranslations = () => {
  const t = useTranslations('postToy');
  
  return {
    // Helper functions pour les cas complexes
    getStepProgress: (currentStep: number, totalSteps: number) => {
      return t('progress.stepProgress', { currentStep, totalSteps });
    },
    
    getProgressPercentage: (percentage: number) => {
      return t('progress.percentage', { percentage });
    },
    
    getCharacterCount: (current: number, max: number) => {
      return t('form.characterCount', { current, max });
    },
    
    getAgeRange: (ageMin: number, ageMax: number) => {
      return t('steps.age.perfectFor', { ageMin, ageMax });
    },
    
    getUploadError: (error: string) => {
      return t('errors.uploadError', { error });
    },
    
    // Header
    header: {
      title: t('header.title'),
      subtitle: t('header.subtitle')
    },
    
    // Progress
    progress: {
      stepOf: t('progress.stepOf')
    },
    
    // Step indicators
    stepIndicators: {
      description: t('stepIndicators.description'),
      age: t('stepIndicators.age'),
      details: t('stepIndicators.details'),
      photos: t('stepIndicators.photos')
    },
    
    // Step 1: Description
    steps: {
      description: {
        title: t('steps.description.title'),
        subtitle: t('steps.description.subtitle'),
        titleLabel: t('steps.description.titleLabel'),
        titlePlaceholder: t('steps.description.titlePlaceholder'),
        descriptionLabel: t('steps.description.descriptionLabel'),
        descriptionPlaceholder: t('steps.description.descriptionPlaceholder')
      },
      
      // Step 2: Age
      age: {
        title: t('steps.age.title'),
        subtitle: t('steps.age.subtitle'),
        minAgeLabel: t('steps.age.minAgeLabel'),
        maxAgeLabel: t('steps.age.maxAgeLabel')
      },
      
      // Step 3: Details
      details: {
        title: t('steps.details.title'),
        subtitle: t('steps.details.subtitle'),
        categoryLabel: t('steps.details.categoryLabel'),
        conditionLabel: t('steps.details.conditionLabel'),
        exchangeTypeLabel: t('steps.details.exchangeTypeLabel'),
        pointsValueLabel: t('steps.details.pointsValueLabel'),
        pointsPlaceholder: t('steps.details.pointsPlaceholder'),
        pointsHelp: t('steps.details.pointsHelp')
      },
      
      // Step 4: Images
      images: {
        title: t('steps.images.title'),
        subtitle: t('steps.images.subtitle'),
        dragText: t('steps.images.dragText'),
        fileInfo: t('steps.images.fileInfo')
      }
    },
    
    // Categories
    categories: {
      construction: t('categories.construction'),
      dolls: t('categories.dolls'),
      vehicles: t('categories.vehicles'),
      boardGames: t('categories.boardGames'),
      books: t('categories.books'),
      other: t('categories.other')
    },
    
    // Conditions
    conditions: {
      new: t('conditions.new'),
      veryGood: t('conditions.veryGood'),
      good: t('conditions.good'),
      used: t('conditions.used')
    },
    
    // Exchange modes
    exchangeModes: {
      donation: t('exchangeModes.donation'),
      exchange: t('exchangeModes.exchange'),
      points: t('exchangeModes.points')
    },
    
    // Navigation
    navigation: {
      previous: t('navigation.previous'),
      next: t('navigation.next'),
      publish: t('navigation.publish'),
      publishing: t('navigation.publishing')
    },
    
    // Success screen
    success: {
      title: t('success.title'),
      subtitle: t('success.subtitle'),
      viewAllToys: t('success.viewAllToys'),
      myDashboard: t('success.myDashboard')
    },
    
    // Messages
    messages: {
      toyAdded: t('messages.toyAdded'),
      maxImages: t('messages.maxImages'),
      addError: t('messages.addError')
    },
    
    // Errors
    errors: {
      generalError: t('errors.generalError')
    }
  };
};