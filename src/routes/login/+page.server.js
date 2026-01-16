export const prerender = false;

import { error, redirect } from '@sveltejs/kit';
export const actions = {
	// Login
	default: async ({ locals, request }) => {
		const body = Object.fromEntries(await request.formData());
		const email = body['email'];
		const password = body['password'];

		if (!email && !password) {
			error(400, 'Empty credentials');
		}
		if (!email) {
			error(400, 'Email is missing from login credentials');
		}
		if (!password) {
			error(400, 'Password is missing from login credentials');
		}

		try {
			await locals.pocketBase.collection('users').authWithPassword(email, password);
		} catch (e) {
			/** @typedef {{ code: number, message: string, data: Object }} AuthError */

			const err = /** @type {AuthError} */ (e);
			console.error(err);
			error(err.code ?? 500, err.message ?? 'Unknown error occurred.');
		}

		if (locals.pocketBase.authStore.isValid) {
			locals.user = locals.pocketBase.authStore.model;
			redirect(303, '/');
		} else {
			locals.user = null;
			error(500, 'An error occurred when authenticating');
		}
	}
};
