<script lang="ts">
  import { page } from '$app/stores';
  import type { PageData } from './$types';
  
  export let data: PageData;
</script>

<div class="bg-white shadow sm:rounded-lg">
  <div class="px-4 py-5 sm:p-6">
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">View Animal</h1>
    </div>

    <div class="space-y-6">
      <div>
        <div class="block text-sm font-medium text-gray-700">Name</div>
        <div class="mt-1 text-sm text-gray-900">{data.animal?.name || '-'}</div>
      </div>

      <div>
        <div class="block text-sm font-medium text-gray-700">Species</div>
        <div class="mt-1 text-sm text-gray-900">{data.animal?.animalSpecies || '-'}</div>
      </div>

      <div>
        <div class="block text-sm font-medium text-gray-700">Sex</div>
        <div class="mt-1 text-sm text-gray-900">{data.animal?.sex || '-'}</div>
      </div>

      <div>
        <div class="block text-sm font-medium text-gray-700">Breed</div>
        <div class="mt-1 text-sm text-gray-900">{data.animal?.breed || '-'}</div>
      </div>

      <div>
        <div class="block text-sm font-medium text-gray-700">Microchip Number</div>
        <div class="mt-1 text-sm text-gray-900">{data.animal?.microchip || '-'}</div>
      </div>

      <div>
        <div class="block text-sm font-medium text-gray-700">Birth Date</div>
        <div class="mt-1 text-sm text-gray-900">{data.animal?.birthDate || '-'}</div>
      </div>

      <div>
        <div class="block text-sm font-medium text-gray-700">Health Status</div>
        <div class="mt-1 text-sm text-gray-900">{data.animal?.healthStatus || '-'}</div>
      </div>

      <div class="flex justify-end">
        <a
          href="/animals"
          data-sveltekit-preload-data
          class="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Back
        </a>
      </div>
    </div>
  </div>
</div>