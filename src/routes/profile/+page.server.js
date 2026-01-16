export const prerender = false;

import { error } from '@sveltejs/kit';
export async function load({ locals }) {
	return {
		user: locals.user
	};
}

export const actions = {
	// update image
	updateImage: async ({ locals, request }) => {
		const formData = await request.formData();

		try {
			await locals.pocketBase.collection('users').update(locals.user?.id, formData);
		} catch (e) {
			/** @typedef {{ code: number, message: string, data: Object }} AuthError */

			const err = /** @type {AuthError} */ (e);
			console.error(err);
			error(err.code ?? 500, err.message ?? 'Unknown error occurred.');
		}

		if (locals.pocketBase.authStore.isValid) {
			locals.user = locals.pocketBase.authStore.model;
			return `${locals.user?.collectionId}/${locals.user?.id}/${locals.user?.avatar}`;
		} else {
			locals.user = null;
			error(500, 'An error occurred when authenticating');
		}
	}
};
