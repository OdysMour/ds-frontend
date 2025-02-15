import type { Actions } from './$types';
import { apiCall } from '$lib/config';

export const load = async ({ cookies }) => {
    try {
        console.log("Fetching user profile");
        const token = cookies.get('authToken');
        console.log(token);

        const userData = await apiCall('api/user-profiles', { token });
        const userProfile = userData.data || [];

        console.log(userProfile);
        return {
            userProfile,
            token
        };
    } catch (error) {
        return {
            status: 500,
            body: { error: 'Failed to fetch user profile' }
        };
    }
};
