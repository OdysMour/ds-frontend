<script lang="ts">
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
import { invalidateAll } from '$app/navigation';

let message = $state('Signing out...');

onMount(async () => {
  try {
    // Force invalidation of all data
    await invalidateAll();
    
    // Small delay to ensure invalidation is processed
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Redirect to home page
    await goto('/', { replaceState: true });
    
  } catch (error) {
    message = 'Error signing out. Redirecting...';
    await goto('/', { replaceState: true });
  }
});
</script>

<div class="flex min-h-[50vh] items-center justify-center">
  <div class="text-center">
    <div class="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
      {message}
    </div>
    <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em] dark:border-indigo-500">
      <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  </div>
</div>