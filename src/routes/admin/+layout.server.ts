import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, depends, parent }) => {
  // Get the parent layout data which contains auth state
  const data = await parent();
  
  // Ensure we depend on auth state changes
  depends('app:auth');

  // If not authenticated at all, redirect to signin
  if (!locals.user) {
    throw redirect(303, '/signin');
  }

  // Check if user has admin role
  if (!locals.user.roles.includes('ROLE_ADMIN')) {
    throw redirect(303, '/');
  }

  // Return the parent data to ensure state consistency
  return {
    ...data
  };
};