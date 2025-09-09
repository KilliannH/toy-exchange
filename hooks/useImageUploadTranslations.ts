// hooks/useImageUploadTranslations.ts
import { useTranslations } from 'next-intl';

export const useImageUploadTranslations = () => {
  const t = useTranslations('components.imageUpload');
  
  return {
    // Upload zone content
    uploadZone: {
      altText: t('uploadZone.altText'),
      dragAndDrop: t('uploadZone.dragAndDrop'),
      clickToChoose: t('uploadZone.clickToChoose')
    }
  };
};