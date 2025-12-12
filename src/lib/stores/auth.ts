import { writable, derived } from 'svelte/store';
import type { EduRuangUser } from '../types/gamification';

// User store
export const currentUser = writable<EduRuangUser | null>(null);
export const isAuthenticated = derived(currentUser, ($user) => $user !== null);

// Helper function to convert string dates back to Date objects
function parseUserDates(user: any): EduRuangUser | null {
	if (user) {
		return {
			...user,
			joinDate: new Date(user.joinDate),
			lastActive: new Date(user.lastActive)
		};
	}
	return user;
}

// Initialize user from localStorage if available
if (typeof window !== 'undefined') {
  const storedUser = localStorage.getItem('edu-ruang-user');
  if (storedUser) {
    try {
      currentUser.set(parseUserDates(JSON.parse(storedUser)));
    } catch (e) {
      localStorage.removeItem('edu-ruang-user');
    }
  }
}

// Subscribe to user changes to save to localStorage
currentUser.subscribe((user) => {
  if (typeof window !== 'undefined') {
    if (user) {
      // Convert Date objects to strings for localStorage
      const userToStore = {
        ...user,
        joinDate: user.joinDate.toISOString(),
        lastActive: user.lastActive.toISOString()
      };
      localStorage.setItem('edu-ruang-user', JSON.stringify(userToStore));
    } else {
      localStorage.removeItem('edu-ruang-user');
    }
  }
});

export const authFunctions = {
  login: (user: EduRuangUser) => {
    currentUser.set(user);
  },
  logout: () => {
    currentUser.set(null);
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  },
  updateUser: (updates: Partial<EduRuangUser>) => {
    currentUser.update(user => user ? { ...user, ...updates } : null);
  }
};