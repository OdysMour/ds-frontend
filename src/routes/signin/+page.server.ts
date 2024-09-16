import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    login: async ({ request, cookies }) => {
        const formData = await request.formData();
        const username = formData.get('username');
        const password = formData.get('password');

        // Replace this with your actual backend login logic
        const response = await fetch('http://localhost:9090/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            const token = data.accessToken;
            console.log(token);
            // Set the token in a cookie
            cookies.set('authToken', token, {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 // 1 day
            });
            redirect(302, '../');
            // Redirect to the dashboard or another protected route
            
/*             return {
                status: 302,
                headers: {
                    location: '/about'
                }
            }; */
        } else {
            // Handle login error
            // const data = await response.json();

            // console.log(response.status);

            return {
                status: response.status,
               body: { error: 'Invalid credentials' }
            };
        }
    }
};
