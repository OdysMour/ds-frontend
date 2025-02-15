<script lang="ts">
import { enhance } from '$app/forms';
import type { ActionData, PageData } from './$types';
import type { ActionResult } from '@sveltejs/kit';
import { signinSchema, type SigninFormData } from '$lib/schemas';

const { form, data } = $props<{
  form?: ActionData;
  data: PageData;
}>();

interface FormState extends SigninFormData {
  error: string;
  isLoading: boolean;
  errors: {
    username?: string;
    password?: string;
  };
}

let formState = $state<FormState>({
  username: '',
  password: '',
  error: '',
  isLoading: false,
  errors: {}
});

const validateForm = () => {
  const result = signinSchema.safeParse(formState);
  if (!result.success) {
    const flattenedErrors = result.error.flatten().fieldErrors;
    formState.errors = {
      username: flattenedErrors.username?.[0],
      password: flattenedErrors.password?.[0]
    };
    return false;
  }
  formState.errors = {};
  return true;
};

const handleSubmit = () => {
  formState.isLoading = true;
  formState.error = '';

  if (!validateForm()) {
    formState.isLoading = false;
    return;
  }

  return async ({ result, update }: {
    result: ActionResult;
    update: (options?: { reset?: boolean; invalidateAll?: boolean; }) => Promise<void>;
  }) => {
    formState.isLoading = false;
    
    if (result.type === 'failure' || (result.type === 'success' && result.status >= 400)) {
      formState.error = result.data?.error || 'Login failed. Please check your credentials.';
      return;
    }

    // On success, invalidate all data to force a reload
    await update({ invalidateAll: true });
  };
};
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Sign in to your account
      </h2>
      {#if data.message}
        <div class="mt-4 p-4 rounded-md bg-green-50 border border-green-400">
          <p class="text-center text-sm text-green-700">{data.message}</p>
        </div>
      {/if}
    </div>
    <form method="POST" action="?/login" use:enhance={handleSubmit} class="mt-8 space-y-6">
      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="username" class="sr-only">Username</label>
          <input 
            id="username" 
            name="username" 
            type="text" 
            required 
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm {formState.errors.username ? 'border-red-500' : ''}"
            placeholder="Username"
            bind:value={formState.username}
            disabled={formState.isLoading}
          />
          {#if formState.errors.username}
            <p class="mt-1 text-sm text-red-600">{formState.errors.username}</p>
          {/if}
        </div>
        <div>
          <label for="password" class="sr-only">Password</label>
          <input 
            id="password" 
            name="password" 
            type="password" 
            required 
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm {formState.errors.password ? 'border-red-500' : ''}"
            placeholder="Password"
            bind:value={formState.password}
            disabled={formState.isLoading}
          />
          {#if formState.errors.password}
            <p class="mt-1 text-sm text-red-600">{formState.errors.password}</p>
          {/if}
        </div>
      </div>

      <div>
        <button 
          type="submit" 
          disabled={formState.isLoading}
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {formState.isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </div>

      {#if formState.error || (form?.data?.body?.error)}
        <p class="mt-2 text-center text-sm text-red-600">
          {formState.error || form?.data?.body?.error || ''}
        </p>
      {/if}
    </form>

    <p class="mt-2 text-center text-sm text-gray-600">
      Don't have an account?
      <a href="/signup" class="font-medium text-blue-600 hover:text-blue-500">
        Sign up
      </a>
    </p>
  </div>
</div>
