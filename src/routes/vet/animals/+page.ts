import type { PageData as ServerPageData } from './+page.server';

export const load = (({ data }) => {
    return data;
});

export type PageData = ServerPageData;