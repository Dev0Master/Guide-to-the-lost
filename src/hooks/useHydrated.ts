import { useState, useEffect } from 'react';

/**
 * Hook to check if component has hydrated on client side
 * Prevents hydration mismatches by ensuring server/client render same initially
 */
export function useHydrated() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}