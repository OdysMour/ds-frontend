import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { animalSchema } from '$lib/schemas';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const form = await superValidate(zod(animalSchema));
  return { form };
};