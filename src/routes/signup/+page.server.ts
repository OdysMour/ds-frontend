import { error, fail, redirect } from '@sveltejs/kit';
import type { Action, Actions, PageServerLoad } from './$types';

/* export const load: PageServerLoad = async (session) => {
  var sessionData = session.cookies.get('session');
  if (sessionData) {
    return redirect(303, '/');
  }
  return {};
}; */

export const actions = {
  register: async ({ request }) => {
    console.log("Registering user");
    // TODO register the user
    const data = await request.formData();
    const username = data.get('username');
    const email = data.get('email');
    const password = data.get('password');

    if (typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string' || !username || !password || !email) {
      return error(400, 'Username, Email and Password must be a string');
    }
    console.log(username, email, password);

    const response = await fetch('http://localhost:9090/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);

      // Redirect to the dashboard or another protected route
      throw redirect(302, '/signin');
    } else {
      // Handle signup error
      const data = await response.json();

      console.log(data);
      return fail(400, { error: 'Registration failed' });
    }

  }
} satisfies Actions;



