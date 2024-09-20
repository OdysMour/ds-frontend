import { redirect } from "@sveltejs/kit";

export const actions = {
    signout: async ({ cookies }) => {
        // Clear the session cookie
        cookies.delete('authToken', { path: '/' });
        // Redirect to the sign-in page
        throw redirect(302, '/signin');
    }
};