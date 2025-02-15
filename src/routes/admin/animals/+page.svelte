<script lang="ts">
  import { onMount } from 'svelte';
  import { getAllAnimals, deleteAnimal, updateAnimalHealth } from '$lib/api/animals';
  import type { Animal } from '$lib/types';

  export let data;
  const token = data.user?.token;

  let animals: Animal[] = [];
  let loading = true;
  let error: string | null = null;
  let healthStatusEdit: { [key: number]: string } = {};
  let editingHealth: number | null = null;

  onMount(async () => {
    try {
      animals = await getAllAnimals(token);
      // Initialize health status edit values
      animals.forEach(animal => {
        healthStatusEdit[animal.id] = animal.healthStatus;
      });
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load animals';
    } finally {
      loading = false;
    }
  });

  async function handleHealthUpdate(animal: Animal) {
    if (!healthStatusEdit[animal.id]?.trim()) {
      error = 'Health status cannot be empty';
      return;
    }

    try {
      const updatedAnimal = await updateAnimalHealth(animal.id, healthStatusEdit[animal.id], token);
      animals = animals.map(a => a.id === animal.id ? updatedAnimal : a);
      editingHealth = null;
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to update health status';
    }
  }

  async function handleDelete(animal: Animal) {
    if (!confirm(`Are you sure you want to delete animal ${animal.name}?`)) {
      return;
    }

    try {
      await deleteAnimal(animal.id, token);
      animals = animals.filter(a => a.id !== animal.id);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to delete animal';
    }
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
</script>

<div class="px-4 sm:px-6 lg:px-8">
  <div class="sm:flex sm:items-center">
    <div class="sm:flex-auto">
      <h1 class="text-2xl font-semibold text-gray-900">Animals</h1>
      <p class="mt-2 text-sm text-gray-700">A list of all animals in the system.</p>
    </div>
    <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
      <a
        href="/admin/animals/new"
        class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
      >
        Add animal
      </a>
    </div>
  </div>

  {#if error}
    <div class="mt-4 rounded-md bg-red-50 p-4">
      <div class="flex">
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <div class="mt-2 text-sm text-red-700">
            <p>{error}</p>
          </div>
        </div>
      </div>
    </div>
  {/if}

  {#if loading}
    <div class="mt-6 flex justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p class="mt-2 text-sm text-gray-500">Loading animals...</p>
      </div>
    </div>
  {:else}
    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Name
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Species & Breed
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Birth Date
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Health Status
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Owner
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                {#each animals as animal (animal.id)}
                  <tr>
                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {animal.name}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {animal.animalSpecies} - {animal.breed}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatDate(animal.birthDate)}
                    </td>
                    <td class="whitespace-normal px-3 py-4 text-sm text-gray-500 max-w-xs">
                      {#if editingHealth === animal.id}
                        <div class="flex items-center gap-2">
                          <input
                            type="text"
                            bind:value={healthStatusEdit[animal.id]}
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                          <button
                            on:click={() => handleHealthUpdate(animal)}
                            class="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            Save
                          </button>
                          <button
                            on:click={() => {
                              editingHealth = null;
                              healthStatusEdit[animal.id] = animal.healthStatus;
                            }}
                            class="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            Cancel
                          </button>
                        </div>
                      {:else}
                        <div class="flex items-center gap-2">
                          <span>{animal.healthStatus}</span>
                          <button
                            on:click={() => editingHealth = animal.id}
                            class="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                        </div>
                      {/if}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {animal.userProfile?.firstName} {animal.userProfile?.lastName}
                    </td>
                    <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div class="flex justify-end gap-4">
                        <a
                          href="/admin/animals/{animal.id}"
                          class="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </a>
                        <button
                          on:click={() => handleDelete(animal)}
                          class="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>