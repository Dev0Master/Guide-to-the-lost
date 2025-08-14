import { create } from 'zustand';
import { tokenManager } from '@/lib/tokenManager';

interface User {
  id: string;
  displayName: string;
  email: string;
  role: 'lost_person' | 'searcher' | 'staff' | 'main_center_staff';
  disabled: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (user: Partial<User>) => void;
  initAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,

  setAuth: (user: User, token: string) => {
    tokenManager.setToken(token);
    // Save user data to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('userData', JSON.stringify(user));
    }
    set({
      user,
      accessToken: token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  clearAuth: () => {
    tokenManager.removeToken();
    // Remove user data from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userData');
    }
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  updateUser: (userData: Partial<User>) => {
    const { user } = get();
    if (user) {
      set({
        user: { ...user, ...userData },
      });
    }
  },

  initAuth: () => {
    const token = tokenManager.getToken();
    if (token && typeof window !== 'undefined') {
      // Try to get user data from localStorage
      const userData = localStorage.getItem('userData');
      console.log('Raw userData from localStorage:', userData);
      if (userData) {
        try {
          const user = JSON.parse(userData);
          console.log('Parsed user data:', user);
          set({
            user,
            accessToken: token,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Error parsing userData:', error);
          // If user data is corrupted, clear everything
          tokenManager.removeToken();
          localStorage.removeItem('userData');
        }
      } else {
        // If no user data but token exists, clear the token as well
        tokenManager.removeToken();
      }
    }
  },
}));