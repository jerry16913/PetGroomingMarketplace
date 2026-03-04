import type { User } from '@/types';
import { users } from '@/lib/mock/users';

const STORAGE_KEY = 'currentUser';

/**
 * Read the currently logged-in user from localStorage.
 * Returns null if no user is stored or if running on the server.
 */
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

/**
 * Authenticate against mock users.
 * On success, persists the user in localStorage and returns the User.
 * On failure, returns null.
 */
export function login(email: string, password: string): User | null {
  // In mock mode every user's password is "password"
  if (password !== 'password') return null;

  const user = users.find((u) => u.email === email) ?? null;

  if (user && typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  return user;
}

/**
 * Remove the current user from localStorage (log out).
 */
export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get the role of the currently logged-in user.
 */
export function getRole(): 'customer' | 'groomer' | 'admin' | null {
  const user = getCurrentUser();
  return user?.role ?? null;
}

/**
 * Check whether the current user has the required role.
 */
export function requireRole(role: string): boolean {
  const currentRole = getRole();
  return currentRole === role;
}
