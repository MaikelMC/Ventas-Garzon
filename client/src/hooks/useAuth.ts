import { useEffect } from 'react';
import { useAuthStore } from '../store';

export function useAuth() {
  const { user, isLoggedIn, setAuthFromStorage } = useAuthStore();

  useEffect(() => {
    setAuthFromStorage();
  }, [setAuthFromStorage]);

  return {
    user,
    isLoggedIn,
  };
}
