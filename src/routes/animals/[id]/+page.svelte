<script lang="ts">
import { onMount } from 'svelte';
import { page } from '$app/stores';
import { animals } from '$lib/api';
import { animalSchema, type Animal } from '$lib/schemas';
import { superForm } from 'sveltekit-superforms/client';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageData } from './$types';

export let data: PageData;

const id = Number($page.params.id);
const isNew = id === 0 || isNaN(id);

let loading = !isNew;
let error: string | null = null;

const { form, errors, enhance } = superForm(data.form, {
  validators: zod(animalSchema),
  onSubmit: async () => {
    try {
      if (isNew) {
        await animals.create($form);
      } else {
        await animals.update(id, $form);
      }
      window.location.href = '/animals';
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to save animal';
      return false;
    }
  }
});

onMount(async () => {
  if (!isNew) {
    try {
      const animalData = await animals.getOne(id);
      $form = { ...animalData };
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load animal';
    } finally {
      loading = false;
    }
  }
});
</script>

<div class="bg-white shadow sm:rounded-lg">
  <div class="px-4 py-5 sm:p-6">
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">
        {isNew ? 'Add New Animal' : 'Edit Animal'}
      </h1>
    </div>

    {#if loading}
      <div class="flex justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    {:else if error}
      <div class="bg-red-50 p-4 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-red-800">{error}</p>
          </div>
        </div>
      </div>
    {:else}
      <form method="POST" use:enhance>
        <div class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              bind:value={$form.name}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {#if $errors.name}
              <p class="mt-1 text-sm text-red-600">{$errors.name}</p>
            {/if}
          </div>

          <div>
            <label for="species" class="block text-sm font-medium text-gray-700">Species</label>
            <select
              id="species"
              bind:value={$form.animalSpecies}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="DOG">Dog</option>
              <option value="CAT">Cat</option>
            </select>
            {#if $errors.animalSpecies}
              <p class="mt-1 text-sm text-red-600">{$errors.animalSpecies}</p>
            {/if}
          </div>

          <div>
            <label for="sex" class="block text-sm font-medium text-gray-700">Sex</label>
            <select
              id="sex"
              bind:value={$form.sex}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
            {#if $errors.sex}
              <p class="mt-1 text-sm text-red-600">{$errors.sex}</p>
            {/if}
          </div>

          <div>
            <label for="breed" class="block text-sm font-medium text-gray-700">Breed</label>
            <input
              type="text"
              id="breed"
              bind:value={$form.breed}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {#if $errors.breed}
              <p class="mt-1 text-sm text-red-600">{$errors.breed}</p>
            {/if}
          </div>

          <div>
            <label for="microchip" class="block text-sm font-medium text-gray-700">Microchip Number</label>
            <input
              type="number"
              id="microchip"
              bind:value={$form.microchip}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {#if $errors.microchip}
              <p class="mt-1 text-sm text-red-600">{$errors.microchip}</p>
            {/if}
          </div>

          <div>
            <label for="birthDate" class="block text-sm font-medium text-gray-700">Birth Date</label>
            <input
              type="date"
              id="birthDate"
              bind:value={$form.birthDate}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {#if $errors.birthDate}
              <p class="mt-1 text-sm text-red-600">{$errors.birthDate}</p>
            {/if}
          </div>

          <div>
            <label for="healthStatus" class="block text-sm font-medium text-gray-700">Health Status</label>
            <select
              id="healthStatus"
              bind:value={$form.healthStatus}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="HEALTHY">Healthy</option>
              <option value="SICK">Sick</option>
              <option value="UNDER_TREATMENT">Under Treatment</option>
            </select>
            {#if $errors.healthStatus}
              <p class="mt-1 text-sm text-red-600">{$errors.healthStatus}</p>
            {/if}
          </div>

          <div class="flex justify-end space-x-3">
            <a
              href="/animals"
              class="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </a>
            <button
              type="submit"
              class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isNew ? 'Create' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    {/if}
  </div>
</div>