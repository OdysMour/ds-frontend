import { error, redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { createRateLimitedFetch } from '$lib/rateLimiter';
import { env } from '$env/dynamic/public';

// Protect the route - only allow admin role to access it
export const load = async ({ locals }: { locals: App.Locals }) => {
  if (!locals.user) {
    throw redirect(302, '/signin');
  }

  const isAdmin = locals.user.roles?.includes('ROLE_ADMIN');

  if (!isAdmin) {
    throw error(403, 'Unauthorized: Admin access required');
  }

  return {};
};

export const actions = {
  create: async (event: RequestEvent) => {
    try {
      const { request, cookies, fetch } = event;
      const formData = await request.formData();
      const animalData = {
        name: formData.get('name')?.toString() || undefined,
        sex: formData.get('sex')?.toString(),
        animalSpecies: formData.get('animalSpecies')?.toString(),
        breed: formData.get('breed')?.toString() || undefined,
        birthDate: formData.get('birthDate')?.toString() 
          ? new Date(formData.get('birthDate')!.toString()).toISOString()
          : undefined,
        microchip: formData.get('microchip')?.toString()
          ? Number(formData.get('microchip')) 
          : undefined
      };

      const authToken = cookies.get('authToken');
      if (!authToken) {
        throw error(401, 'Unauthorized');
      }

      const rateLimitedFetch = createRateLimitedFetch({ fetchFn: fetch });
  
      const response = await rateLimitedFetch(`${env.PUBLIC_API_URL}/api/animals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(animalData)
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw error(429, 'Too many requests. Please try again later.');
        }
        
        const errorData = await response.json().catch(() => null);
        if (errorData?.message) {
          throw error(response.status, errorData.message);
        }
        
        throw error(response.status, 'Failed to create animal');
      }

      throw redirect(303, '/admin/animals');
    } catch (err) {
      if (err instanceof Error) {
        throw error(500, err.message);
      }
      throw err;
    }
  }
};