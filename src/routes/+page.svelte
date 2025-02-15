<script lang="ts">
import { page } from '$app/stores';
import { derived } from 'svelte/store';

const user = derived(page, $page => $page.data.user);
const isAuthenticated = derived(user, $user => $user.authenticated);
</script>

<svelte:head>
<title>Home</title>
<meta name="description" content="Animal Management System" />
</svelte:head>

<section>
<h1 class="text-3xl font-bold text-gray-900 mb-6">Welcome to Animal Management System</h1>

{#if $isAuthenticated}
<div class="text-center">
  <p class="text-lg text-gray-600 mb-4">You are logged in as {$user.username}</p>
  <a href="/animals" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
    View Animals
  </a>
</div>
{:else}
<div class="text-center">
  <p class="text-lg text-gray-600 mb-4">Please sign in to manage animals</p>
  <div class="space-x-4">
    <a href="/signin" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 border-indigo-600">
      Sign In
    </a>
    <a href="/signup" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
      Sign Up
    </a>
  </div>
</div>
{/if}
</section>

<style>
section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 0.6;
  padding: 2rem;
}
</style>
