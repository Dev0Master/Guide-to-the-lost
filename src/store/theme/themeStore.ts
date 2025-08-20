import { create } from 'zustand';

export type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  isInitialized: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',
  isInitialized: false,
  
  setTheme: (theme: Theme) => {
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedTheme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
    
    set({ theme });
  },

  toggleTheme: () => {
    const { theme } = get();
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    get().setTheme(newTheme);
  },

  initializeTheme: () => {
    if (get().isInitialized) return;
    
    if (typeof window !== 'undefined') {
      // Check for saved theme preference
      const savedTheme = localStorage.getItem('selectedTheme') as Theme;
      
      let themeToApply: Theme;
      
      if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
        themeToApply = savedTheme;
      } else {
        // Fallback to system preference
        themeToApply = window.matchMedia('(prefers-color-scheme: dark)').matches 
          ? 'dark' 
          : 'light';
      }
      
      document.documentElement.classList.toggle('dark', themeToApply === 'dark');
      localStorage.setItem('selectedTheme', themeToApply);
      
      set({ 
        theme: themeToApply,
        isInitialized: true 
      });
    } else {
      set({ isInitialized: true });
    }
  },
}));