import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { signupSchema } from '$lib/schemas';
import { ZodError } from 'zod';
import { apiCall } from '$lib/config';

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    try {
      const validatedData = signupSchema.parse(data);
      
      try {
        const result = await apiCall('api/auth/signup', {
          method: 'POST',
          body: {
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            email: validatedData.email,
            password: validatedData.password,
            username: validatedData.username || undefined,
            role: ['user'] // Send as array since it will be converted to Set in backend
          }
        });

        console.log('Signup response:', result);
        
        // If we reach here, the registration was successful because apiCall will throw on error responses

      } catch (error: any) {
        console.error('Signup error details:', error);
        
        // Handle API errors
        if (error.data?.errors?.length > 0) {
          // Handle validation errors from backend
          return fail(error.status || 400, {
            data: { 
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              username: data.username 
            },
            error: error.data.errors[0] // Use first error message
          });
        } else if (error.data?.message) {
          // Handle other API errors with message
          return fail(error.status || 400, {
            data: { 
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              username: data.username 
            },
            error: error.data.message
          });
        }
        
        // Handle unexpected errors
        return fail(500, {
          error: 'An unexpected error occurred. Please try again.'
        });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.reduce((acc: Record<string, string>, curr) => {
          const path = curr.path[0];
          acc[path.toString()] = curr.message;
          return acc;
        }, {});
        
        return fail(400, {
          data,
          errors
        });
      }
      
      // Handle other unexpected errors
      console.error('Signup validation error:', error);
      return fail(500, {
        error: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'
      });
    }
    return redirect(303, '/signin');
  }
} satisfies Actions;
