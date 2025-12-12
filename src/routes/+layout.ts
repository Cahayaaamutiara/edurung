import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import type { EduRuangUser } from '$lib/types/gamification';

interface LayoutData {
	user: EduRuangUser | null;
}

// Helper function to convert string dates back to Date objects
function parseUserDates(user: any): EduRuangUser {
	if (user) {
		return {
			...user,
			joinDate: new Date(user.joinDate),
			lastActive: new Date(user.lastActive)
		};
	}
	return user;
}

export async function load({ url }): Promise<LayoutData> {
	if (browser) {
		const storedUser = localStorage.getItem('edu-ruang-user');
		const isLoginPage = url.pathname === '/login' || url.pathname === '/login-role';
		
		if (!storedUser && !isLoginPage) {
			goto('/login-role');
			return { user: null };
		}
		
		if (storedUser && isLoginPage) {
			// Redirect based on user role
			try {
				const user: EduRuangUser = parseUserDates(JSON.parse(storedUser));
				if (user.role === 'guru') {
					goto('/dashboard/guru');
				} else {
					goto('/dashboard/murid');
				}
				return { user };
			} catch (e) {
				// If parsing fails, redirect to login
				goto('/login-role');
				return { user: null };
			}
		}
		
		// Return user data for other pages
		if (storedUser) {
			try {
				const user: EduRuangUser = parseUserDates(JSON.parse(storedUser));
				return { user };
			} catch (e) {
				// If parsing fails, clear invalid data
				localStorage.removeItem('edu-ruang-user');
				return { user: null };
			}
		}
	}
	
	return { user: null };
}