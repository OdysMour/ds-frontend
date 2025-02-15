import type { PageLoad } from './$types';
import type { Animal } from '$lib/schemas';

export const load: PageLoad = async ({ parent, data }) => {
  const { user } = await parent();
  const { animals } = data as { animals: Animal[] };
  return {
    user,
    animals
  };
};