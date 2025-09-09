// hooks/useRegisterTranslations.ts
import { useTranslations } from 'next-intl';

export const useRegisterTranslations = () => {
  const t = useTranslations('register');
  
  return {
    // Helper functions pour les cas complexes
    getPasswordStrength: (length: number) => {
      if (length < 4) return t('form.passwordStrength.weak');
      if (length < 6) return t('form.passwordStrength.medium');
      if (length < 8) return t('form.passwordStrength.good');
      return t('form.passwordStrength.excellent');
    },
    
    getStepLabel: (stepNum: number) => {
      return stepNum === 1 ? t('steps.infos') : t('steps.security');
    },
    
    getTermsText: () => {
      const termsLink = `<a href="/legal/terms" target="_blank" class="text-emerald-400 hover:text-emerald-300 underline transition-colors">${t('form.termsLink')}</a>`;
      const privacyLink = `<a href="/legal/privacy" target="_blank" class="text-emerald-400 hover:text-emerald-300 underline transition-colors">${t('form.privacyLink')}</a>`;
      return t('form.acceptTerms', { termsLink, privacyLink });
    },
    
    // Header
    header: {
      title: t('header.title'),
      subtitle: t('header.subtitle')
    },
    
    // Steps
    steps: {
      infos: t('steps.infos'),
      security: t('steps.security')
    },
    
    // Authentication
    auth: {
      continueWithGoogle: t('auth.continueWithGoogle'),
      orWithEmail: t('auth.orWithEmail')
    },
    
    // Form step 1
    form: {
      nameLabel: t('form.nameLabel'),
      namePlaceholder: t('form.namePlaceholder'),
      cityLabel: t('form.cityLabel'),
      cityPlaceholder: t('form.cityPlaceholder'),
      emailLabel: t('form.emailLabel'),
      emailPlaceholder: t('form.emailPlaceholder'),
      nextButton: t('form.nextButton'),
      noResults: t('form.noResults'),
      
      // Step 2
      passwordLabel: t('form.passwordLabel'),
      passwordPlaceholder: t('form.passwordPlaceholder'),
      passwordStrengthLabel: t('form.passwordStrengthLabel'),
      
      // Terms
      acceptTermsPrefix: t('form.acceptTermsPrefix'),
      termsLink: t('form.termsLink'),
      privacyLink: t('form.privacyLink'),
      acceptTermsSuffix: t('form.acceptTermsSuffix'),
      
      // Buttons
      backButton: t('form.backButton'),
      createAccount: t('form.createAccount'),
      creating: t('form.creating')
    },
    
    // Password strength
    passwordStrength: {
      weak: t('form.passwordStrength.weak'),
      medium: t('form.passwordStrength.medium'),
      good: t('form.passwordStrength.good'),
      excellent: t('form.passwordStrength.excellent')
    },
    
    // Success step
    success: {
      title: t('success.title'),
      subtitle: t('success.subtitle')
    },
    
    // Footer
    footer: {
      alreadyAccount: t('footer.alreadyAccount'),
      signIn: t('footer.signIn'),
      dataProtected: t('footer.dataProtected')
    },
    
    // Benefits
    benefits: {
      title: t('benefits.title'),
      environmental: t('benefits.environmental'),
      savings: t('benefits.savings'),
      community: t('benefits.community'),
      unlimited: t('benefits.unlimited')
    },
    
    // Messages
    messages: {
      accountCreated: t('messages.accountCreated'),
      registrationError: t('messages.registrationError')
    }
  };
};