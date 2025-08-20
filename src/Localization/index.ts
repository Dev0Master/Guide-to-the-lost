// Central localization exports
export { homeTranslations, type HomeTranslations } from './home/homeTranslations';
export { lostPersonTranslations, type LostPersonTranslations } from './lost-person/lostPersonTranslations';
export { findPersonTranslations, type FindPersonTranslations } from './find-person/findPersonTranslations';
export { loginTranslations, type LoginTranslations } from './login/loginTranslations';
export { navigationTranslations, type NavigationTranslations } from './navigation/navigationTranslations';
export { uiTranslations, type UITranslations } from './ui/uiTranslations';
export { errorTranslations, type ErrorTranslations } from './error/errorTranslations';
export { debugTranslations, type DebugTranslations } from './debug/debugTranslations';

// Helper function to get translations by language and feature
export function getFeatureTranslations<T>(
  translations: Record<'ar' | 'en' | 'fa', T>,
  language: 'ar' | 'en' | 'fa' = 'ar'
): T {
  return translations[language] || translations['ar']; // Arabic as fallback base language
}