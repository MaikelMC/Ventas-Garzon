'use client';

const ADMIN_PASSWORD_KEY = 'admin_password';
const ADMIN_LOGGED_IN_KEY = 'admin_logged_in';

export const ADMIN_PASSWORD = 'canaria2026';

export function getAdminAuth(): { isLoggedIn: boolean } {
  if (typeof window === 'undefined') return { isLoggedIn: false };
  const loggedIn = localStorage.getItem(ADMIN_LOGGED_IN_KEY) === 'true';
  return { isLoggedIn: loggedIn };
}

export function loginAdmin(password: string): boolean {
  if (typeof window === 'undefined') return false;
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(ADMIN_LOGGED_IN_KEY, 'true');
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_LOGGED_IN_KEY);
}
