import { redirect } from "@sveltejs/kit";

export const actions = {
    default: async ({ cookies}) => {
	// Clear the session cookie
	cookies.delete('authToken', { path: '/' });
    return {
        redirect: '/signin',
        authToken: null
    }
}
}