import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { dev } from '$app/environment';
import { apiCall } from '$lib/config';

export const load: PageServerLoad = async ({ cookies, url }) => {
  const authToken = cookies.get('authToken');
  if (authToken) {
    throw redirect(303, '/');
  }
  return {
    message: url.searchParams.get('message')
  };
};

interface SigninResponse {
  accessToken: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
}

export const actions = {
  login: async ({ request, cookies }) => {
    try {
      const data = await request.formData();
      const username = data.get('username');
      const password = data.get('password');

      // Input validation
      if (!username || !password) {
        return fail(400, {
          error: 'Username and password are required'
        });
      }

      if (typeof username !== 'string' || typeof password !== 'string') {
        return fail(400, {
          error: 'Invalid input types'
        });
      }

      const responseData: SigninResponse = await apiCall('api/auth/signin', {
        method: 'POST',
        body: { username, password }
      }).catch(err => {
        if (err.status === 401) {
          return fail(401, {
            error: 'Invalid credentials'
          });
        }
        throw err;
      });

      if (!responseData) return;

      const token = responseData.accessToken;

      if (!token) {
        return fail(500, {
          error: 'No token received from server'
        });
      }

      // Set the auth token cookie with secure options
      cookies.set('authToken', token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: !dev, // Use secure cookies in production
        maxAge: 60 * 60 * 24 // 1 day
      });

      // Store user roles in a separate cookie for frontend access control
      cookies.set('userRoles', JSON.stringify(responseData.roles), {
        path: '/',
        httpOnly: false, // Allow JavaScript access
        sameSite: 'strict',
        secure: !dev, // Use secure cookies in production
        maxAge: 60 * 60 * 24 // 1 day
      });


    } catch (err) {
      console.error('Login error:', err);
      return fail(500, {
        error: 'An unexpected error occurred during login'
      });
    }
          // The layout will automatically re-run its load function due to cookie changes
          return redirect(302, '/');


  }
} satisfies Actions;
