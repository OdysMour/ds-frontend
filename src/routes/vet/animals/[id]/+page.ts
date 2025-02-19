import type { PageData as ServerPageData, ActionResult } from './+page.server';

// Re-export the server types
export type PageData = ServerPageData;

// Define the load function
export function load({ data }: { data: ServerPageData }) {
    return {
        animal: data.animal,
        user: data.user
    };
}

export type { ActionResult };