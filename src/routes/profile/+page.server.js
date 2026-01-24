import { redirect, error } from '@sveltejs/kit';
export async function load({ locals }) {
	if (!locals.pocketBase.authStore.isValid) {
		error(401, 'Cannot view profile because you are not logged in.');
	}
	return {
		user: locals.user ?? locals.pocketBase.authStore.model
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
	},

	updateUser: async ({ locals, request }) => {
		const formData = Object.fromEntries(await request.formData());

		const displayName = formData['displayName'];

		if (!displayName) {
			error(400, 'Display name cannot be empty');
		}

		const newPassword = formData['newPassword'];

		const confirmPassword = formData['confirmPassword'];

		if ((newPassword || confirmPassword) && newPassword !== confirmPassword) {
			error(400, 'Password fields do not match.');
		}

		const passwordChange = newPassword && confirmPassword && newPassword === confirmPassword;

		if (passwordChange) {
			const oldPassword = formData['oldPassword'];
			if (!oldPassword) {
				error(400, 'Old password is missing');
			}

			try {
				await locals.pocketBase.collection('users').update(locals.user?.id, {
					displayName,
					oldPassword,
					password: newPassword,
					passwordConfirm: confirmPassword
				});
			} catch (e) {
				/** @typedef {{ code: number, message: string, data: Object }} AuthError */

				const err = /** @type {AuthError} */ (e);
				console.error(err);
				error(err.code ?? 500, err.message ?? 'Unknown error occurred.');
			}

			await locals.pocketBase.authStore.clear();
			locals.user = null;
			redirect(303, '/login');
		} 
		// basically it can only be display name change here
		else {
			try {
				await locals.pocketBase.collection('users').update(locals.user?.id, {
					displayName
				});
			} catch (e) {
				/** @typedef {{ code: number, message: string, data: Object }} AuthError */

				const err = /** @type {AuthError} */ (e);
				console.error(err);
				console.error(err.data);
				error(err.code ?? 500, err.message ?? 'Unknown error occurred.');
			}

			if (locals.pocketBase.authStore.isValid) {
				locals.user = locals.pocketBase.authStore.model;
			}
			redirect(303, '/profile');
		}
	}
};
