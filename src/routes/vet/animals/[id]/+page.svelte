<script lang="ts">
    import type { Animal } from '$lib/schemas';
    import type { ActionResult } from './+page.server';
    import { enhance } from '$app/forms';

    interface PageData {
        animal: Animal;
        user: {
            id?: number;
            username?: string;
            roles: string[];
            token: string;
        };
    }

    export let data: PageData;
    export let form: ActionResult | null = null;

    const isAdmin = data.user.roles.includes('ROLE_ADMIN');
    const isVet = data.user.roles.includes('ROLE_VET');
    
    let success = false;
    $: formError = form?.error || '';
</script>
<div class="bg-white shadow sm:rounded-lg p-6">
    <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
            Edit Animal: {data.animal.name || 'Unnamed'}
        </h3>

        {#if formError}
            <div class="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
                <p class="text-sm text-red-700">{formError}</p>
            </div>
        {/if}

        {#if success}
            <div class="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
                <p class="text-sm text-green-700">Changes saved successfully!</p>
            </div>
        {/if}

        <form
            method="POST"
            action="?/update"
            use:enhance={() => {
                return async ({ result }) => {
                    success = result.type === 'success';
                    formError = result.type === 'error' ? 'Failed to save changes' : '';
                };
            }}
            class="mt-5 space-y-6"
        >
            {#if isAdmin}
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        id="name" 
                        value={data.animal.name || ''} 
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label for="microchip" class="block text-sm font-medium text-gray-700">Microchip Number</label>
                    <input 
                        type="number" 
                        name="microchip" 
                        id="microchip" 
                        value={data.animal.microchip || ''} 
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label for="birthDate" class="block text-sm font-medium text-gray-700">Birth Date</label>
                    <input 
                        type="date" 
                        name="birthDate" 
                        id="birthDate" 
                        value={data.animal.birthDate ? data.animal.birthDate.split('T')[0] : ''} 
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
            {/if}

            {#if isVet || isAdmin}
                <div>
                    <label for="healthStatus" class="block text-sm font-medium text-gray-700">Health Status</label>
                    <select 
                        name="healthStatus" 
                        id="healthStatus"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="HEALTHY" selected={data.animal.healthStatus === 'HEALTHY'}>Healthy</option>
                        <option value="SICK" selected={data.animal.healthStatus === 'SICK'}>Sick</option>
                        <option value="CRITICAL" selected={data.animal.healthStatus === 'CRITICAL'}>Critical</option>
                        <option value="RECOVERING" selected={data.animal.healthStatus === 'RECOVERING'}>Recovering</option>
                    </select>
                </div>
            {/if}

            <div class="mt-5">
                <button
                    type="submit"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Save Changes
                </button>
            </div>
        </form>
    </div>
</div>