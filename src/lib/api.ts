import { authService } from './auth';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

const BASE_URL = env.PUBLIC_API_URL || 'http://localhost:9090';

async function handleResponse(response: Response) {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json') || contentType?.includes('application/hal+json');
  console.log(`[API] Processing response with content-type:`, contentType);

  let data;
  try {
    data = isJson ? await response.json() : await response.text();
    console.log(`[API] Parsed response data:`, data);
  } catch (err) {
    console.error(`[API] Error parsing response:`, err);
    throw error(500, 'Failed to parse response');
  }

  if (!response.ok) {
    console.error(`[API] Request failed:`, {
      status: response.status,
      data: data
    });
    if (response.status === 401) {
      console.log('[API] Unauthorized - clearing tokens');
      authService.clearTokens();
      throw error(401, 'Unauthorized');
    }
    throw error(response.status, data.message || 'Something went wrong');
  }

  return data;
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = authService.getAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  console.log(`[API] Making request to ${endpoint}`, {
    method: options.method || 'GET',
    headers: headers
  });

  const response = await fetch(`${BASE_URL}/api${endpoint}`, {
    ...options,
    headers,
  });

  console.log(`[API] Response from ${endpoint}:`, {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries())
  });

  return handleResponse(response);
}

// Auth endpoints
export const auth = {
  signin: (credentials: { username: string; password: string }) =>
    fetchWithAuth('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  signup: (userData: any) =>
    fetchWithAuth('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
};

// Animals endpoints
export const animals = {
  getAll: () => fetchWithAuth('/animals'),
  
  getOne: (id: number) => fetchWithAuth(`/animals/${id}`),
  
  create: (animal: any) =>
    fetchWithAuth('/animals', {
      method: 'POST',
      body: JSON.stringify(animal),
    }),
  
  update: (id: number, animal: any) =>
    fetchWithAuth(`/animals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(animal),
    }),
  
  delete: (id: number) =>
    fetchWithAuth(`/animals/${id}`, {
      method: 'DELETE',
    }),

  updateHealthStatus: (id: number, status: string) =>
    fetchWithAuth(`/animals/${id}/health-status`, {
      method: 'PATCH',
      body: JSON.stringify(status),
    }),
};

// Health checks endpoints
export const healthChecks = {
  getAll: () => fetchWithAuth('/health-checks'),
  
  getOne: (id: number) => fetchWithAuth(`/health-checks/${id}`),
  
  getByAnimal: (animalId: number) =>
    fetchWithAuth(`/health-checks/animal/${animalId}`),
  
  create: (animalId: number, healthCheck: any) =>
    fetchWithAuth(`/health-checks/animal/${animalId}`, {
      method: 'POST',
      body: JSON.stringify(healthCheck),
    }),
  
  update: (id: number, healthCheck: any) =>
    fetchWithAuth(`/health-checks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(healthCheck),
    }),
  
  delete: (id: number) =>
    fetchWithAuth(`/health-checks/${id}`, {
      method: 'DELETE',
    }),
};

// User profile endpoints
export const profiles = {
  getCurrent: () => fetchWithAuth('/user-profiles/me'),
  
  getAll: () => fetchWithAuth('/user-profiles'),
  
  getOne: (id: number) => fetchWithAuth(`/user-profiles/${id}`),
  
  create: (profile: any) =>
    fetchWithAuth('/user-profiles', {
      method: 'POST',
      body: JSON.stringify(profile),
    }),
  
  delete: (id: number) =>
    fetchWithAuth(`/user-profiles/${id}`, {
      method: 'DELETE',
    }),
  
  linkCitizen: (profileId: number, citizenId: number) =>
    fetchWithAuth(`/user-profiles/${profileId}/citizen/${citizenId}`, {
      method: 'PUT',
    }),
  
  unlinkCitizen: (profileId: number) =>
    fetchWithAuth(`/user-profiles/${profileId}/citizen`, {
      method: 'DELETE',
    }),
};

// Citizens endpoints
export const citizens = {
  getAll: () => fetchWithAuth('/citizens'),
  
  getOne: (id: number) => fetchWithAuth(`/citizens/${id}`),
  
  create: (citizen: any) =>
    fetchWithAuth('/citizens', {
      method: 'POST',
      body: JSON.stringify(citizen),
    }),
  
  update: (id: number, citizen: any) =>
    fetchWithAuth(`/citizens/${id}`, {
      method: 'PUT',
      body: JSON.stringify(citizen),
    }),
  
  delete: (id: number) =>
    fetchWithAuth(`/citizens/${id}`, {
      method: 'DELETE',
    }),
};