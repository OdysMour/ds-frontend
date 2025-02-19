import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { makeApiUrl } from '$lib/config';
import type { Animal } from '$lib/schemas';

export interface PageData {
    animals: Animal[];
    user: {
        id?: number;
        username?: string;
        roles: string[];
        token: string;
    };
}

export const load: PageServerLoad = async ({ fetch, locals }) => {
    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }

    const response = await fetch(makeApiUrl('api/animals'), {
        headers: {
            'Authorization': `Bearer ${locals.user.token}`
        }
    });

    if (!response.ok) {
        throw error(response.status, 'Failed to load animals');
    }

    const animals: Animal[] = await response.json();

    return {
        animals,
        user: locals.user
    };
};