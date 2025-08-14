import { create } from 'zustand';

export type Language = 'ar' | 'en' | 'fa';

interface LanguageState {
  currentLanguage: Language;
  direction: 'ltr' | 'rtl';
  isInitialized: boolean;
  setLanguage: (language: Language) => void;
  initializeLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  currentLanguage: 'ar',
  direction: 'rtl',
  isInitialized: false,
  
  setLanguage: (language: Language) => {
    const direction = language === 'en' ? 'ltr' : 'rtl';
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedLanguage', language);
      document.documentElement.dir = direction;
      document.documentElement.lang = language;
    }
    
    set({ 
      currentLanguage: language,
      direction 
    });
  },

  initializeLanguage: () => {
    if (get().isInitialized) return;
    
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('selectedLanguage') as Language;
      if (savedLanguage && ['ar', 'en', 'fa'].includes(savedLanguage)) {
        const direction = savedLanguage === 'en' ? 'ltr' : 'rtl';
        document.documentElement.dir = direction;
        document.documentElement.lang = savedLanguage;
        set({ 
          currentLanguage: savedLanguage,
          direction,
          isInitialized: true 
        });
      } else {
        set({ isInitialized: true });
      }
    }
  },
}));