import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;
  
  if (!user) {
    throw redirect(302, '/signin');
  }

  // Check if user has admin role
  const hasAdminRole = user.roles.includes('ROLE_ADMIN');
  if (!hasAdminRole) {
    throw redirect(302, '/');
  }

  // Redirect to users management by default
  throw redirect(302, '/admin/users');
};