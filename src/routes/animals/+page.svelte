<script lang="ts">
	import type { ActionData } from './$types';
    
	export let data;
	const {animalsData, token} = data;
    
</script>

<table>
	<thead>
		<tr>
			<th>Sex</th>
			<th>Animal Species</th>
			<th>Birth Date</th>
            <th>Microchip</th>
        </tr>
	</thead>
	<tbody>
        {#if animalsData}
		{#each animalsData as animal}
			<tr>
				<td>{animal.sex}</td>
				<td>{animal.animalSpecies}</td>
				<td>{animal.birthDate}</td>
                <td>{animal.microchip}</td>
			</tr>
		{/each}
        {:else}
        <tr>
            <td colspan="4">No animals found</td>
        </tr>
        {/if}
	</tbody>
</table>

<form method="POST" action="?/addAnimal">
	<label for="sex">Sex:</label>
	<select id="sex" name="sex" required>
		<option value="MALE">MALE</option>
		<option value="FEMALE">FEMALE</option>
	</select>

	<label for="animalSpecies">Animal Species:</label>
    <select id="animalSpecies" name="animalSpecies" required>
		<option value="CAT">CAT</option>
		<option value="DOG">DOG</option>
	</select>
	<label for="birthDate">Birth Date:</label>
	<input type="datetime-local" id="birthDate" name="birthDate" required />

    <label for="microchip">Microchip:</label>
	<input type="number" id="microchip" name="microchip" required />


	<button type="submit">Add Animal</button>
</form>

<style>
	table {
		width: 100%;
		border-collapse: collapse;
	}

	th, td {
		border: 1px solid #ddd;
		padding: 8px;
		text-align: left;
	}
	th {
		background-color: #f2f2f2;
	}
</style>