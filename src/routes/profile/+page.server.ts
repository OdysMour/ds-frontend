import type { Actions } from './$types';
export const load = async ({cookies}) => {
	try {
		console.log("Fetching user profile");
        const token = cookies.get('authToken'); // Get token from cookies
		console.log(token);
		const response = await fetch('http://localhost:9090/api/user-profiles', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // Add token to headers
            }
        });
		const userData = await response.json();
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
