import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, depends }) => {
  // Tell SvelteKit this data depends on auth state
  depends('app:auth');
  return {
    user: locals.user ? {
      authenticated: true,
      username: locals.user.username,
      roles: locals.user.roles
    } : {
      authenticated: false,
      roles: []
    }
  };
};
