// hooks/useEditToyTranslations.ts
import { useTranslations } from 'next-intl';

export const useEditToyTranslations = () => {
  const t = useTranslations('toysEdit');
  
  return {
    // Header
    header: {
      title: t('header.title'),
      subtitle: t('header.subtitle')
    },
    
    // Basic info section
    basicInfo: {
      title: t('basicInfo.title'),
      titleField: {
        label: t('basicInfo.titleField.label'),
        placeholder: t('basicInfo.titleField.placeholder')
      },
      description: {
        label: t('basicInfo.description.label'),
        placeholder: t('basicInfo.description.placeholder')
      }
    },
    
    // Age range section
    ageRange: {
      title: t('ageRange.title'),
      minAge: {
        label: t('ageRange.minAge.label')
      },
      maxAge: {
        label: t('ageRange.maxAge.label')
      },
      suitableFor: t('ageRange.suitableFor')
    },
    
    // Images management section
    images: {
      title: t('images.title'),
      slotsAvailable: t('images.slotsAvailable'),
      currentImages: t('images.currentImages'),
      addNewImages: t('images.addNewImages'),
      dragAndDrop: {
        title: t('images.dragAndDrop.title'),
        subtitle: t('images.dragAndDrop.subtitle')
      },
      newImagesToAdd: t('images.newImagesToAdd'),
      limitReached: {
        title: t('images.limitReached.title'),
        subtitle: t('images.limitReached.subtitle')
      },
      newLabel: t('images.newLabel')
    },
    
    // Action buttons
    actions: {
      cancel: t('actions.cancel'),
      save: t('actions.save'),
      saving: t('actions.saving')
    },
    
    // Error messages
    errors: {
      updateError: t('errors.updateError'),
      tooManyImages: t('errors.tooManyImages')
    }
  };
};