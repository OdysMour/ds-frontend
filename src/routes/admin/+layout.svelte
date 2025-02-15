<script lang="ts">
  import { page } from '$app/stores';
  import { derived } from 'svelte/store';

  // Get user from page data
  const user = derived(page, $page => $page.data.user);
  
  // Log authentication state changes for debugging
  $: {
    console.log('[Admin Layout] Auth state:', {
      authenticated: $user !== undefined,
      roles: $user?.roles,
      path: $page.url.pathname
    });
  }
</script>

{#if $user && $user.roles.includes('ROLE_ADMIN')}
  <div class="border-b border-gray-200 mb-8">
    <div class="flex space-x-8 py-4">
      <a 
        href="/admin/users" 
        class="text-sm font-medium {$page.url.pathname.startsWith('/admin/users') ? 'text-indigo-600 border-b-2 border-indigo-500' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
      >
        Users
      </a>
      <a 
        href="/admin/animals" 
        class="text-sm font-medium {$page.url.pathname.startsWith('/admin/animals') ? 'text-indigo-600 border-b-2 border-indigo-500' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
      >
        Animals
      </a>
    </div>
  </div>
{/if}

<slot />