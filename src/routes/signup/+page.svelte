<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import type { ActionData } from './$types';

  export let form: ActionData;

  let loading = false;
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
  <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Create your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Or
        <a href="/signin" class="font-medium text-indigo-600 hover:text-indigo-500">
          sign in to your account
        </a>
      </p>
    </div>

    <form class="mt-8 space-y-6" method="POST" use:enhance={() => {
      loading = true;
      return async ({ update, result }) => {
        loading = false;
        if (result.type === 'redirect') {
          await goto(result.location);
          return;
        }
        await update();
      };
    }}>
      {#if form?.error}
        <div class="p-4 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
          {form.error}
        </div>
      {/if}

      <div class="space-y-4">
        <div>
          <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
          <input 
            id="firstName" 
            name="firstName" 
            type="text" 
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={form?.data?.firstName ?? ''}
            minlength="2"
            maxlength="50"
          />
          {#if form?.errors?.firstName}
            <p class="mt-1 text-sm text-red-600">{form.errors.firstName}</p>
          {/if}
        </div>

        <div>
          <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
          <input 
            id="lastName" 
            name="lastName" 
            type="text" 
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={form?.data?.lastName ?? ''}
            minlength="2"
            maxlength="50"
          />
          {#if form?.errors?.lastName}
            <p class="mt-1 text-sm text-red-600">{form.errors.lastName}</p>
          {/if}
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            required
            autocomplete="email"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={form?.data?.email ?? ''}
            maxlength="50"
          />
          {#if form?.errors?.email}
            <p class="mt-1 text-sm text-red-600">{form.errors.email}</p>
          {/if}
        </div>

        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">Username (optional)</label>
          <input 
            id="username" 
            name="username" 
            type="text" 
            autocomplete="username"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={form?.data?.username ?? ''}
            maxlength="20"
          />
          {#if form?.errors?.username}
            <p class="mt-1 text-sm text-red-600">{form.errors.username}</p>
          {/if}
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input 
            id="password" 
            name="password" 
            type="password"
            required
            autocomplete="new-password"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            minlength="8"
            maxlength="40"
            data-requirements="Must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character"
          />
          {#if form?.errors?.password}
            <p class="mt-1 text-sm text-red-600">{form.errors.password}</p>
          {/if}
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input 
            id="confirmPassword" 
            name="confirmPassword" 
            type="password"
            required
            autocomplete="new-password"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {#if form?.errors?.confirmPassword}
            <p class="mt-1 text-sm text-red-600">{form.errors.confirmPassword}</p>
          {/if}
        </div>
      </div>

      <div>
        <button
          type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          disabled={loading}
        >
          {#if loading}
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          {/if}
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </div>
    </form>
  </div>
</div>
