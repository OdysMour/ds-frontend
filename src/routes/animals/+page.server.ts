import type { RequestHandler } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load = async ({ cookies }) => {
    try {
        console.log("Fetching animals");
        const token = cookies.get('authToken'); // Get token from cookies

        const response = await fetch('http://localhost:9090/api/animals', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // Add token to headers
            }
        });
        //console.log(response);
        if (response.ok) {
            const animalsData = await response.json();
            console.log(animalsData);
            return {
                animalsData,
                token
            };
        } else {
            console.log("Failed to fetch animals");
            return {
                status: 500,
                body: { error: 'Failed to fetch animals' }
            };
        }
    } catch (error) {
        return {
            status: 500,
            body: { error: 'Failed to fetch animals' }
        };
    }
};
export const actions: Actions = {
    addAnimal: async ({ request, cookies }) => {
        console.log("Adding animal");
        const formData = await request.formData();
        const sex = formData.get('sex');
        const animalSpecies = formData.get('animalSpecies');
        const birthDate = formData.get('birthDate');
        const microchip = formData.get('microchip');

        const token = cookies.get('authToken'); // Get token from cookies

        const response = await fetch('http://localhost:9090/api/animals', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Add token to headers
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sex, animalSpecies, birthDate, microchip })
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            console.log("Animal added successfully");
            return { success: 'Animal added successfully' };
        } else {
            console.log("Failed to add animal");
            return { error: 'Failed to add animal' };
        }
    }
};