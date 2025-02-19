import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getAllAnimals, deleteAnimal, updateAnimalHealth } from '$lib/api/animals';
import type { Animal } from '$lib/types';

interface ServerData {
    animals: Animal[];
}

export const load: PageServerLoad<ServerData> = async ({ locals }) => {
    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }

    try {
        const animals = await getAllAnimals(locals.user.token);
        return {
            animals
        };
    } catch (e) {
        throw error(500, {
            message: e instanceof Error ? e.message : 'Failed to load animals'
        });
    }
};

export const actions: Actions = {
    updateHealth: async ({ request, locals }) => {
        if (!locals.user) {
            throw error(401, 'Unauthorized');
        }

        const data = await request.formData();
        const animalId = Number(data.get('animalId'));
        const healthStatus = data.get('healthStatus')?.toString();

        if (!animalId || !healthStatus?.trim()) {
            return fail(400, {
                error: { message: 'Missing required fields' }
            });
        }

        try {
            const animal = await updateAnimalHealth(animalId, healthStatus, locals.user.token);
            return { animal };
        } catch (e) {
            return fail(500, {
                error: { message: e instanceof Error ? e.message : 'Failed to update health status' }
            });
        }
    },

    delete: async ({ request, locals }) => {
        if (!locals.user) {
            throw error(401, 'Unauthorized');
        }

        const data = await request.formData();
        const animalId = Number(data.get('animalId'));

        if (!animalId) {
            return fail(400, {
                error: { message: 'Missing animal ID' }
            });
        }

        try {
            await deleteAnimal(animalId, locals.user.token);
            return { success: true };
        } catch (e) {
            return fail(500, {
                error: { message: e instanceof Error ? e.message : 'Failed to delete animal' }
            });
        }
    }
};