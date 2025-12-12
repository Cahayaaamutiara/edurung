// Layout file for profile edit page
// This ensures the page follows the same authentication rules as other profile pages

import { browser } from '$app/environment';
import { goto } from '$app/navigation';

export async function load({ url }) {
	if (browser) {
		const storedUser = localStorage.getItem('edu-ruang-user');
		
		// Redirect to login if not authenticated
		if (!storedUser) {
			goto('/login');
			return;
		}
	}
	
	return {};
}