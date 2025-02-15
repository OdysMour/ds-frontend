<!--
  Animals List Page
  - Data is loaded server-side in +page.server.ts which includes rate limiting and error handling
  - The loaded animals data is merged with parent user data in +page.ts
  - No client-side fetching needed as we use the server-loaded data directly
-->
<script lang="ts">
  import type { Animal } from '$lib/schemas';
  import type { PageData } from './$types';

  export let data: PageData;
  
  console.log('User data:', data.user);
  const canCreateAnimal = data.user.roles.some(role =>
    ['ROLE_USER','ROLE_EMPLOYEE', 'ROLE_VET', 'ROLE_ADMIN'].includes(role)
  );
  const isAdminOrVet = data.user.roles.some(role => 
    ['ROLE_ADMIN', 'ROLE_VET'].includes(role)
  );
  console.log('Can create animal:', canCreateAnimal);

  const getHealthStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'sick':
        return 'bg-red-100 text-red-800';
      case 'under_treatment':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  $: animalsList = data.animals;
</script>

<div class="bg-white shadow sm:rounded-lg">
  <div class="px-4 py-5 sm:p-6">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Animals</h1>
        <p class="mt-2 text-sm text-gray-700">
          {#if isAdminOrVet}
            A list of all animals in the system
          {:else}
            A list of your registered animals
          {/if}
        </p>
      </div>
      {#if canCreateAnimal}
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <a
            href="/animals/new"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add animal
          </a>
        </div>
      {/if}
    </div>

    {#if animalsList.length === 0}
      <div class="mt-8 text-center">
        <p class="text-sm text-gray-500">
          {#if isAdminOrVet}
            No animals found in the system
          {:else}
            You haven't registered any animals yet
          {/if}
        </p>
      </div>
    {:else}
      <div class="mt-8 flex flex-col">
        <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Species</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Breed</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Sex</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Health Status</th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span class="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  {#each animalsList as animal}
                    <tr>
                      <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {animal.name || 'Unnamed'}
                      </td>
                      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{animal.animalSpecies}</td>
                      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{animal.breed || '-'}</td>
                      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{animal.sex}</td>
                      <td class="whitespace-nowrap px-3 py-4 text-sm">
                        <span class="inline-flex rounded-full px-2 text-xs font-semibold leading-5 {getHealthStatusColor(animal.healthStatus)}">
                          {animal.healthStatus || 'Unknown'}
                        </span>
                      </td>
                      <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a href="/animals/{animal.id}" class="text-indigo-600 hover:text-indigo-900">
                          View<span class="sr-only">, {animal.name}</span>
                        </a>
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
</div>