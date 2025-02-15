import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, depends }) => {
  // Clear authentication tokens first
  cookies.delete('authToken', { path: '/' });
  cookies.delete('userRoles', { path: '/' });
  
  // Notify layout to update auth state
  depends('app:auth');
  
  // Return instead of redirect to let client handle navigation
  return { success: true };
};