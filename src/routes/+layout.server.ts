
export function load({ cookies }) {
	const authToken = cookies.get('authToken') || null;

	return {
		authToken: authToken
	};
    
}

