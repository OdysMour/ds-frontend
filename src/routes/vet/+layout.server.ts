import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    // Ensure user is logged in and has vet or admin role
    if (!locals.user) {
        throw redirect(303, '/signin');
    }

    const roles = locals.user.roles;
    if (!roles.includes('ROLE_VET') && !roles.includes('ROLE_ADMIN')) {
        throw redirect(303, '/');
    }

    return {
        user: locals.user
    };
};