// hooks/useLoginTranslations.ts
import { useTranslations } from 'next-intl';

export const useLoginTranslations = () => {
  const t = useTranslations('login');
  
  return {
    // Page principale
    pageTitle: t('pageTitle'),
    pageSubtitle: t('pageSubtitle'),
    
    // Formulaire
    form: {
      emailPlaceholder: t('form.emailPlaceholder'),
      passwordPlaceholder: t('form.passwordPlaceholder'),
      signInButton: t('form.signInButton'),
      signingIn: t('form.signingIn'),
      authError: t('form.authError')
    },
    
    // Séparateur
    or: t('divider.or'),
    
    // Google
    continueWithGoogle: t('google.continueWithGoogle'),
    
    // Pied de page
    footer: {
      noAccount: t('footer.noAccount'),
      createAccount: t('footer.createAccount'),
      forgotPassword: t('footer.forgotPassword')
    }
  };
};