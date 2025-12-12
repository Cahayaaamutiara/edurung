import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
  const { user } = await parent();
  
  // If user is not logged in, redirect to login
  if (!user) {
    throw redirect(302, '/login-role');
  }
  
  // Redirect based on user role
  if (user.role === 'guru') {
    throw redirect(302, '/dashboard/guru');
  } else {
    throw redirect(302, '/dashboard/murid');
  }
};