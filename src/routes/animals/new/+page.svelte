<script lang="ts">
  import { enhance } from '$app/forms';
  import type { AnimalFormData } from '$lib/schemas';
  import { animalSchema } from '$lib/schemas';

  let formData: AnimalFormData = {
    sex: 'MALE',
    animalSpecies: 'DOG'
  };

  let errors: Record<string, string> = {};
  let successMessage = '';
  let errorMessage = '';

  const validateForm = () => {
    console.log('Validating animal form data:', formData);
    try {
      animalSchema.parse(formData);
      errors = {};
      console.log('Form validation successful');
      return true;
    } catch (err: any) {
      errors = {};
      err.errors.forEach((error: any) => {
        const field = error.path[0];
        errors[field] = error.message;
      });
      console.log('Form validation failed:', errors);
      return false;
    }
  };
</script>

<div class="bg-white shadow sm:rounded-lg">
  <div class="px-4 py-5 sm:p-6">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Add New Animal</h1>
        <p class="mt-2 text-sm text-gray-700">Fill in the details to register a new animal</p>
      </div>
    </div>

    {#if errorMessage}
      <div class="mt-4 bg-red-50 p-4 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-red-800">{errorMessage}</p>
          </div>
        </div>
      </div>
    {/if}

    {#if successMessage}
      <div class="mt-4 bg-green-50 p-4 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">{successMessage}</p>
          </div>
        </div>
      </div>
    {/if}

    <form
      method="POST"
      action="?/create"
      use:enhance={({ formElement }) => {
        if (!validateForm()) {
          return;
        }
        
        console.log('Submitting animal form:', formData);
        
        return async ({ result, update }) => {
          console.log('Server response:', result);
          if (result.type === 'success') {
            successMessage = 'Animal created successfully';
            formElement.reset();
            formData = { sex: 'MALE', animalSpecies: 'DOG' };
            console.log('Animal created successfully');
          } else {
            errorMessage = 'Failed to create animal';
            console.error('Failed to create animal:', result);
          }
          await update();
        };
      }}
      class="mt-6 space-y-6"
    >
      <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
          <div class="mt-1">
            <input
              type="text"
              name="name"
              id="name"
              bind:value={formData.name}
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          {#if errors.name}
            <p class="mt-2 text-sm text-red-600">{errors.name}</p>
          {/if}
        </div>

        <div>
          <label for="sex" class="block text-sm font-medium text-gray-700">Sex*</label>
          <div class="mt-1">
            <select
              id="sex"
              name="sex"
              bind:value={formData.sex}
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>
          {#if errors.sex}
            <p class="mt-2 text-sm text-red-600">{errors.sex}</p>
          {/if}
        </div>

        <div>
          <label for="animalSpecies" class="block text-sm font-medium text-gray-700">Species*</label>
          <div class="mt-1">
            <select
              id="animalSpecies"
              name="animalSpecies"
              bind:value={formData.animalSpecies}
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            >
              <option value="DOG">Dog</option>
              <option value="CAT">Cat</option>
            </select>
          </div>
          {#if errors.animalSpecies}
            <p class="mt-2 text-sm text-red-600">{errors.animalSpecies}</p>
          {/if}
        </div>

        <div>
          <label for="breed" class="block text-sm font-medium text-gray-700">Breed</label>
          <div class="mt-1">
            <input
              type="text"
              name="breed"
              id="breed"
              bind:value={formData.breed}
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          {#if errors.breed}
            <p class="mt-2 text-sm text-red-600">{errors.breed}</p>
          {/if}
        </div>

        <div>
          <label for="birthDate" class="block text-sm font-medium text-gray-700">Birth Date</label>
          <div class="mt-1">
            <input
              type="date"
              name="birthDate"
              id="birthDate"
              bind:value={formData.birthDate}
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          {#if errors.birthDate}
            <p class="mt-2 text-sm text-red-600">{errors.birthDate}</p>
          {/if}
        </div>

        <div>
          <label for="microchip" class="block text-sm font-medium text-gray-700">Microchip Number</label>
          <div class="mt-1">
            <input
              type="number"
              name="microchip"
              id="microchip"
              bind:value={formData.microchip}
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          {#if errors.microchip}
            <p class="mt-2 text-sm text-red-600">{errors.microchip}</p>
          {/if}
        </div>
      </div>

      <div class="flex justify-end gap-3">
        <a
          href="/animals"
          class="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </a>
        <button
          type="submit"
          class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Save
        </button>
      </div>
    </form>
  </div>
</div>