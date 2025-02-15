import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;
  
  if (!user) {
    throw redirect(302, '/signin');
  }

  const hasAdminRole = user.roles.includes('ROLE_ADMIN');
  if (!hasAdminRole) {
    throw redirect(302, '/');
  }

  return {
    user: locals.user
  };
};