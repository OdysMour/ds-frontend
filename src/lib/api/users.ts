import { z } from 'zod';
import type { User } from '$lib/types';
import { ROLE_TYPES } from '$lib/types';
import { API_URL } from '$lib/config';

// Zod schemas for validation
const userIdSchema = z.number().int().positive();
const rolesSchema = z.array(z.enum(ROLE_TYPES));
const enabledSchema = z.boolean();

export async function getAllUsers(token?: string): Promise<User[]> {
  const response = await fetch(`${API_URL}/api/users`, {
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

export async function updateUserRoles(userId: number, roles: string[], token?: string): Promise<User> {
  // Validate inputs
  const validatedUserId = userIdSchema.parse(userId);
  const validatedRoles = rolesSchema.parse(roles);

  const response = await fetch(`${API_URL}/api/users/${validatedUserId}/roles`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    credentials: 'include',
    body: JSON.stringify(validatedRoles)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

export async function updateUserStatus(userId: number, enabled: boolean, token?: string): Promise<User> {
  // Validate inputs
  const validatedUserId = userIdSchema.parse(userId);
  const validatedEnabled = enabledSchema.parse(enabled);

  const response = await fetch(`${API_URL}/api/users/${validatedUserId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    credentials: 'include',
    body: JSON.stringify(validatedEnabled)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

export async function deleteUser(userId: number, token?: string): Promise<void> {
  // Validate input
  const validatedUserId = userIdSchema.parse(userId);

  const response = await fetch(`${API_URL}/api/users/${validatedUserId}`, {
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