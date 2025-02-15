import { createRateLimitedFetch } from '$lib/rateLimiter';
import { redirect, type Handle } from '@sveltejs/kit';
import { apiCall } from '$lib/config';
import { makeApiUrl } from '$lib/config';

// Protected routes that require authentication
const protectedRoutes = ['/profile', '/animals', '/admin'];

// Routes that require admin role
const adminRoutes = ['/admin'];

// Create rate limited fetch instance for server-side calls
const rateLimitedFetch = createRateLimitedFetch({
  requestsPerSecond: 10, // Match backend limit
  retryAfter: 1000,
  maxRetries: 3
});

// Handle requests
export const handle: Handle = async ({ event, resolve }) => {
  console.log('[Server] Incoming request:', {
    path: event.url.pathname,
    method: event.request.method,
    timestamp: new Date().toISOString()
  });

  // Inject rate limited fetch into event.fetch
  event.fetch = rateLimitedFetch;
  
  const { cookies, url } = event;
  const authToken = cookies.get('authToken');
  const userRoles = cookies.get('userRoles');

  console.log('[Server] Auth check:', {
    hasToken: !!authToken,
    roles: userRoles ? JSON.parse(userRoles) : [],
    path: url.pathname
  });

  // Clear user data from locals by default
  event.locals.user = undefined;

  // Check if trying to access protected route
  const isProtectedRoute = protectedRoutes.some(route => url.pathname.startsWith(route));
  if (isProtectedRoute) {
    console.log('[Server] Protected route access attempt:', url.pathname);
    // If no auth token is present, redirect to signin
    if (!authToken) {
      console.log('[Server] Access denied: No auth token');
      throw redirect(303, `/signin?message=${encodeURIComponent('Please sign in to access this page')}`);
    }

    // For admin routes, check if user has admin role
    if (adminRoutes.some(route => url.pathname.startsWith(route))) {
      const roles = JSON.parse(userRoles || '[]');
      console.log('[Server] Admin route check:', {
        path: url.pathname,
        userRoles: roles
      });
      if (!roles.includes('ROLE_ADMIN')) {
        console.log('[Server] Access denied: Not admin');
        throw redirect(303, `/?message=${encodeURIComponent('Access denied: Admin privileges required')}`);
      }
    }
  }

  // For all routes, if we have an auth token, validate it
  if (authToken) {
    try {
      console.log('[Server] Validating token...');
      // Use rate limited fetch for token verification
      const response = await rateLimitedFetch(makeApiUrl('api/auth/verify'), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('[Server] Token verification failed:', response.status);
        throw new Error(`Token verification failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('[Server] Token verified successfully');

      // Only set user data if verification succeeded
      if (data && data.id) {
        const roles = JSON.parse(userRoles || '[]');
        event.locals.user = {
          id: data.id,
          username: data.username,
          token: authToken,
          roles
        };
        console.log('[Server] User session established:', {
          username: data.username,
          roles
        });
      } else {
        // Invalid response means token is not valid
        console.error('[Server] Invalid token verification response');
        throw new Error('Invalid token verification response');
      }
    } catch (err: any) {
      console.error('[Server] Auth error:', err.message);
      // Only clear cookies if it's not a rate limit error
      if (!err.message?.includes('429') && !err.message?.includes('rate limit')) {
        console.log('[Server] Clearing auth cookies due to error');
        cookies.delete('authToken', { path: '/' });
        cookies.delete('userRoles', { path: '/' });
        
        // Only redirect to signin if accessing protected route
        if (isProtectedRoute) {
          console.log('[Server] Redirecting to signin due to expired session');
          throw redirect(303, `/signin?message=${encodeURIComponent('Session expired. Please sign in again')}`);
        }
      } else {
        console.log('[Server] Rate limit reached');
        // For rate limit errors, keep the session but deny access temporarily
        if (isProtectedRoute) {
          throw redirect(303, `/signin?message=${encodeURIComponent('Too many requests. Please try again later.')}`);
        }
      }
    }
  }

  // Let the request continue
  const response = await resolve(event);
  console.log('[Server] Response:', {
    status: response.status,
    path: url.pathname
  });
  return response;
};