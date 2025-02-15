<script lang="ts">
import '../app.css';
import { page } from '$app/stores';
import { derived } from 'svelte/store';
import { onMount } from 'svelte';

const user = derived(page, $page => {
  const userData = $page.data.user;
  console.log('[Layout] User state changed:', userData);
  return userData;
});

// Check if user exists and has a valid username
const isAuthenticated = derived(user, $user => {
  const auth = $user !== undefined && $user?.username !== undefined;
  console.log('[Layout] Authentication state:', auth);
  return auth;
});

// Track navigation changes
$: {
  console.log('[Layout] Route changed:', $page.url.pathname);
  if ($user?.roles) {
    console.log('[Layout] Available roles:', $user.roles);
  }
}

onMount(() => {
  console.log('[Layout] Component mounted');
});
</script>

<div class="min-h-screen bg-gray-100">
  <nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <a href="/" class="text-xl font-bold text-indigo-600">Animal Management</a>
          </div>
          {#if $isAuthenticated}
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a
                href="/animals"
                class="nav-link {$page.url.pathname.startsWith('/animals') ? 'active' : ''}"
              >
                Animals
              </a>
              {#if $user.roles?.includes('ROLE_ADMIN')}
                <a
                  href="/admin"
                  class="nav-link {$page.url.pathname.startsWith('/admin') ? 'active' : ''}"
                >
                  Admin Dashboard
                </a>
              {/if}
              <a
                href="/profile"
                class="nav-link {$page.url.pathname === '/profile' ? 'active' : ''}"
              >
                Profile
              </a>
            </div>
          {/if}
        </div>
        <div class="flex items-center">
          {#if $isAuthenticated && $user?.username}
            <div class="mr-4 text-sm text-gray-600">
              Welcome, {$user.username}
            </div>
            <a 
              href="/signout" 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Sign Out
            </a>
          {:else}
            <a 
              href="/signin" 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
            >
              Sign In
            </a>
            <a 
              href="/signup" 
              class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Sign Up
            </a>
          {/if}
        </div>
      </div>
    </div>
  </nav>

  <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <slot />
  </main>
</div>

<style lang="postcss">
  .nav-link {
    @apply inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900;
  }
  .nav-link.active {
    @apply border-b-2 border-indigo-500 text-gray-900;
  }
</style>
