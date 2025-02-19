import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { createRateLimitedFetch } from '$lib/rateLimiter';
import { env } from '$env/dynamic/public';

export const load: PageServerLoad = async ({ cookies, fetch, params }) => {
  try {
    const authToken = cookies.get('authToken');
    console.log('[Animal Detail Load] Checking auth token:', authToken ? 'Present' : 'Missing');
    
    if (!authToken) {
      throw error(401, 'Unauthorized');
    }

    const rateLimitedFetch = createRateLimitedFetch({ fetchFn: fetch });
    console.log('[Animal Detail Load] Making request to:', `${env.PUBLIC_API_URL}/api/animals/${params.id}`);

    const response = await rateLimitedFetch(`${env.PUBLIC_API_URL}/api/animals/${params.id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });

    console.log('[Animal Detail Load] Response status:', response.status);
    
    if (!response.ok) {
      if (response.status === 429) {
        console.error('[Animal Detail Load] Rate limit exceeded');
        throw error(429, 'Too many requests. Please try again later.');
      }
      console.error('[Animal Detail Load] Request failed:', {
        status: response.status,
        statusText: response.statusText
      });
      throw error(response.status, 'Failed to fetch animal details');
    }

    const animal = await response.json();
    console.log('[Animal Detail Load] Successfully loaded animal:', animal.id);
    
    return { animal };
  } catch (err: any) {
    console.error('[Animal Detail Load] Error details:', {
      name: err?.name,
      message: err?.message,
      stack: err?.stack,
      cause: err?.cause
    });
    throw error(500, 'Failed to load animal details');
  }
};