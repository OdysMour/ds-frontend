<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;

    const isAdmin = data.user.roles.includes('ROLE_ADMIN');
</script>

<div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
                <h1 class="text-xl font-semibold text-gray-900">Animals</h1>
                <p class="mt-2 text-sm text-gray-700">
                    {#if isAdmin}
                        Manage all animals' details and health status
                    {:else}
                        Manage animals' health status
                    {/if}
                </p>
            </div>
        </div>

        <div class="mt-8 flex flex-col">
            <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table class="min-w-full divide-y divide-gray-300">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Species</th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Health Status</th>
                                    {#if isAdmin}
                                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Microchip</th>
                                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Birth Date</th>
                                    {/if}
                                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                        <span class="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                                {#each data.animals as animal (animal.id)}
                                    <tr>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{animal.name || 'Unnamed'}</td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{animal.animalSpecies}</td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm">
                                            <span class={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 
                                                ${animal.healthStatus === 'HEALTHY' ? 'bg-green-100 text-green-800' : 
                                                animal.healthStatus === 'SICK' ? 'bg-yellow-100 text-yellow-800' : 
                                                animal.healthStatus === 'CRITICAL' ? 'bg-red-100 text-red-800' : 
                                                'bg-blue-100 text-blue-800'}`}>
                                                {animal.healthStatus || 'Unknown'}
                                            </span>
                                        </td>
                                        {#if isAdmin}
                                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{animal.microchip || 'N/A'}</td>
                                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {animal.birthDate ? new Date(animal.birthDate).toLocaleDateString() : 'N/A'}
                                            </td>
                                        {/if}
                                        <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <a href="/vet/animals/{animal.id}" class="text-indigo-600 hover:text-indigo-900">
                                                Edit
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
    </div>
</div>