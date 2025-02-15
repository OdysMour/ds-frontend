export interface User {
  id: number;
  username: string;
  email: string;
  enabled: boolean;
  roles: Role[];
  userProfile?: UserProfile;
}

export interface Role {
  id: number;
  name: string;
}

export interface UserProfile {
  id: number;
  firstName?: string;
  lastName?: string;
}

// Available role types in the system
export const ROLE_TYPES = [
  'user',
  'employee',
  'vet',
  'admin'
] as const;

export type RoleType = typeof ROLE_TYPES[number];

// Animal related types
export interface Animal {
  id: number;
  name: string;
  animalSpecies: string;
  breed: string;
  sex: 'MALE' | 'FEMALE';
  birthDate: string;
  microchip?: string;
  healthStatus: string;
  createdBy: string;
  lastModifiedBy: string;
  userProfile: UserProfile;
}