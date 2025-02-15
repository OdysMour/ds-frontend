import type { Animal } from '$lib/types';
import { API_URL } from '$lib/config';

export async function getAllAnimals(token?: string): Promise<Animal[]> {
  const response = await fetch(`${API_URL}/api/animals`, {
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

export async function getAnimal(id: number, token?: string): Promise<Animal> {
  const response = await fetch(`${API_URL}/api/animals/${id}`, {
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

export async function updateAnimal(id: number, animal: Partial<Animal>, token?: string): Promise<Animal> {
  const response = await fetch(`${API_URL}/api/animals/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    credentials: 'include',
    body: JSON.stringify(animal)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

export async function updateAnimalHealth(id: number, healthStatus: string, token?: string): Promise<Animal> {
  const response = await fetch(`${API_URL}/api/animals/${id}/health-status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    credentials: 'include',
    body: JSON.stringify(healthStatus)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

export async function deleteAnimal(id: number, token?: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/animals/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

export async function createAnimal(animal: Omit<Animal, 'id' | 'createdBy' | 'lastModifiedBy'>, token?: string): Promise<Animal> {
  const response = await fetch(`${API_URL}/api/animals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    credentials: 'include',
    body: JSON.stringify(animal)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}