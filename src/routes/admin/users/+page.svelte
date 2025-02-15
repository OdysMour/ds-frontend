<script lang="ts">
  import { onMount } from 'svelte';
  import { getAllUsers, updateUserRoles, updateUserStatus, deleteUser } from '$lib/api/users';
  import type { User, RoleType } from '$lib/types';
  import { ROLE_TYPES } from '$lib/types';

  export let data;
  const token = data.user?.token;

  let users: User[] = [];
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      users = await getAllUsers(token);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load users';
    } finally {
      loading = false;
    }
  });

  async function handleRoleChange(user: User, role: RoleType, checked: boolean) {
    try {
      const currentRoles = new Set(
        (user.roles ?? [])
          .filter(r => r && r.name)
          .map(r => r.name.replace('ROLE_', ''))
      );
      
      if (checked) {
        currentRoles.add(role);
      } else {
        currentRoles.delete(role);
      }

      const updatedUser = await updateUserRoles(user.id, Array.from(currentRoles), token);
      users = users.map(u => u.id === user.id ? updatedUser : u);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to update user roles';
    }
  }

  async function handleStatusChange(user: User) {
    try {
      const updatedUser = await updateUserStatus(user.id, !user.enabled, token);
      users = users.map(u => u.id === user.id ? updatedUser : u);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to update user status';
    }
  }

  async function handleDelete(user: User) {
    if (!confirm(`Are you sure you want to delete user ${user.username}?`)) {
      return;
    }

    try {
      await deleteUser(user.id, token);
      users = users.filter(u => u.id !== user.id);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to delete user';
    }
  }
</script>

<div class="px-4 sm:px-6 lg:px-8">
  <div class="sm:flex sm:items-center">
    <div class="sm:flex-auto">
      <h1 class="text-2xl font-semibold text-gray-900">Users</h1>
      <p class="mt-2 text-sm text-gray-700">A list of all users in the system and their roles.</p>
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
        <p class="mt-2 text-sm text-gray-500">Loading users...</p>
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
                    Username
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Roles
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                {#each users as user (user.id)}
                  <tr>
                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {user.username}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div class="flex flex-wrap gap-2">
                        {#each ROLE_TYPES as role}
                          <label class="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={user.roles?.some(r => r?.name === `ROLE_${role}`) ?? false}
                              on:change={(e) => handleRoleChange(user, role, e.currentTarget.checked)}
                              class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span class="ml-2 text-sm">{role}</span>
                          </label>
                        {/each}
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <button
                        on:click={() => handleStatusChange(user)}
                        class="rounded-full px-2.5 py-1 text-xs font-semibold {user.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}"
                      >
                        {user.enabled ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button
                        on:click={() => handleDelete(user)}
                        class="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
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