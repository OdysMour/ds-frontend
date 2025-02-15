import type { Animal } from '$lib/schemas';
import type { SuperValidated } from 'sveltekit-superforms';

export interface PageData {
  form: SuperValidated<Animal>;
}