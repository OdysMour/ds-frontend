import { error } from '@sveltejs/kit';
import { createRateLimitedFetch } from '$lib/rateLimiter';
import { env } from '$env/dynamic/public';

export const load = async ({ cookies, fetch }) => {
  try {
    const authToken = cookies.get('authToken');
    console.log('[Animals Load] Checking auth token:', authToken ? 'Present' : 'Missing');
    
    if (!authToken) {
      throw error(401, 'Unauthorized');
    }

    const rateLimitedFetch = createRateLimitedFetch({ fetchFn: fetch });
    console.log('[Animals Load] Making request to:', `${env.PUBLIC_API_URL}/api/animals`);

    const response = await rateLimitedFetch(`${env.PUBLIC_API_URL}/api/animals`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });

    console.log('[Animals Load] Response status:', response.status);
    console.log('[Animals Load] Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      if (response.status === 429) {
        console.error('[Animals Load] Rate limit exceeded');
        throw error(429, 'Too many requests. Please try again later.');
      }
      console.error('[Animals Load] Request failed:', {
        status: response.status,
        statusText: response.statusText
      });
      throw error(response.status, 'Failed to fetch animals');
    }

    const animals = await response.json();
    console.log('[Animals Load] Successfully loaded animals count:', animals.length);
    return { animals };
  } catch (err: any) {
    console.error('[Animals Load] Error details:', {
      name: err?.name,
      message: err?.message,
      stack: err?.stack,
      cause: err?.cause
    });
    throw error(500, 'Failed to load animals');
  }
};

export const actions = {
  create: async ({ request, cookies, fetch }) => {
    try {
      const formData = await request.formData();
      const animalData = Object.fromEntries(formData);

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
        throw error(response.status, 'Failed to create animal');
      }

      return { success: true };
    } catch (err) {
      console.error('Error creating animal:', err);
      throw error(500, 'Failed to create animal');
    }
  }
};