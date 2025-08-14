// Token management utilities - localStorage for axios, cookies for middleware
export const tokenManager = {
  // Get token from localStorage (for axios)
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  },

  // Set token in both localStorage and cookie
  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      // Set in localStorage for axios
      localStorage.setItem('accessToken', token);
      
      // Set in cookie for middleware
      document.cookie = `authToken=${token}; path=/; max-age=86400; SameSite=strict`;
    }
  },

  // Remove token from both localStorage and cookie
  removeToken: (): void => {
    if (typeof window !== 'undefined') {
      // Remove from localStorage
      localStorage.removeItem('accessToken');
      
      // Remove cookie
      document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=strict';
    }
  },

  hasToken: (): boolean => {
    return !!tokenManager.getToken();
  },
};