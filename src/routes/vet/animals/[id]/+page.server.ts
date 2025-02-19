import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { makeApiUrl } from '$lib/config';
import { animalSchema, type Animal } from '$lib/schemas';
import * as animalsApi from '$lib/api/animals';

type UserData = {
    id?: number;
    username?: string;
    roles: string[];
    token: string;
};

export interface PageData {
    animal: Animal;
    user: UserData;
}

export interface ActionResult {
    status: number;
    error?: string;
    animal?: Animal;
}


export const load: PageServerLoad = async ({ params, fetch, locals }) => {
    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }

    const response = await fetch(makeApiUrl(`api/animals/${params.id}`), {
        headers: {
            'Authorization': `Bearer ${locals.user.token}`
        }
    });

    if (!response.ok) {
        throw error(response.status, 'Failed to load animal data');
    }

    const animal = await response.json();
    return {
        animal,
        user: locals.user
    };
};

export const actions: Actions = {
    update: async ({ request, locals, params }) => {
        if (!locals.user) {
            return fail(401, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const isVet = locals.user.roles.includes('ROLE_VET');
        const isAdmin = locals.user.roles.includes('ROLE_ADMIN');

        try {
            // Only allow vets to update health status
            if (isVet && !isAdmin) {
                const healthStatus = formData.get('healthStatus');
                if (!healthStatus || typeof healthStatus !== 'string') {
                    return fail(400, { error: 'Invalid health status' });
                }

                const updatedAnimal = await animalsApi.updateAnimalHealth(
                    Number(params.id),
                    healthStatus,
                    locals.user.token
                );
                
                return {
                    status: 200,
                    animal: updatedAnimal
                };
            }

            // Admin updates
        if (isAdmin) {
            // First get the current animal data
            const response = await fetch(makeApiUrl(`api/animals/${params.id}`), {
                headers: {
                    'Authorization': `Bearer ${locals.user.token}`
                }
            });

            if (!response.ok) {
                return fail(response.status, { error: 'Failed to fetch animal data' });
            }

            const currentAnimal = await response.json();

            // Collect all form data into an object, preserving required fields
            const updateData: Record<string, string> = {
                sex: currentAnimal.sex,
                animalSpecies: currentAnimal.animalSpecies
            };
                for (const [key, value] of formData.entries()) {
                    if (typeof value === 'string' && value.trim()) {
                        switch (key) {
                            case 'name':
                            case 'healthStatus':
                            case 'microchip':
                            case 'birthDate':
                            case 'animalSpecies':
                            case 'sex':
                                // Format date for Java's Date parsing
                                if (key === 'birthDate') {
                                    // Add time component to make it a full datetime
                                    updateData[key] = `${value.trim()}T00:00:00.000Z`;
                                } else {
                                    updateData[key as keyof Animal] = value.trim();
                                }
                                break;
                        }
                    }
                }

                // Only proceed if we have data to update
                if (Object.keys(updateData).length === 0) {
                    return fail(400, { error: 'No valid data provided for update' });
                }

                // Validate the collected data against our schema
                const validatedData = animalSchema.partial().parse(updateData);
                const updatedAnimal = await animalsApi.updateAnimal(
                    Number(params.id),
                    validatedData,
                    locals.user.token
                );

                return {
                    status: 200,
                    animal: updatedAnimal
                };
            }

            return fail(403, { error: 'Forbidden' });
        } catch (err) {
            console.error('Update error:', err);
            return fail(400, {
                error: err instanceof Error ? err.message : 'Failed to update animal'
            });
        }
    }
};