import { redirect, error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	if (!locals.pocketBase.authStore.isValid) {
		error(401, 'Only authorized users can add new blog posts');
	}

	return {};
}

export const actions = {
	// Login
	default: async ({ locals, request }) => {
		if (!locals.pocketBase.authStore.isValid) {
			error(401, 'Only authorized users can add new blog posts');
		}

		const body = Object.fromEntries(await request.formData());

		const title = body['title'];

		const content = body['postContent'];

		const user = locals.user;

		if (!title) {
			error(400, 'Post must have a title');
		}
		if (!content) {
			error(400, 'Post must not be empty');
		}

		try {
			await locals.pocketBase.collection('posts').create({
				title,
				content,
				author: user?.id
			});
		} catch (e) {
			/** @typedef {{ code: number, message: string, data: Object }} AuthError */

			const err = /** @type {AuthError} */ (e);
			console.error(err);
			console.error(err.data);
			error(err.code ?? 400, err.message ?? 'Unknown error occurred.');
		}

		redirect(303, '/blog');
	}
};
