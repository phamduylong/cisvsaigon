import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	if (!locals.pocketBase.authStore.isValid) {
		error(401, 'Only authorized users can add new events');
	}

	return {};
}
