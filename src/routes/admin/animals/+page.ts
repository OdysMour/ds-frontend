import type { Animal } from '$lib/types';
import type { PageLoad } from './$types';

interface PageData {
    animals: Animal[];
}

export const load: PageLoad<PageData> = ({ data }) => {
    return {
        animals: data.animals
    };
};