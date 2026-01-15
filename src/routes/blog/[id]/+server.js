import { redirect, error } from '@sveltejs/kit';

export const DELETE = async ({ locals, params }) => {
	const id = params['id'];
	if (!id) error(400, 'Attempted to delete post with invalid id');

	try {
		await locals.pocketBase.collection('posts').delete(id);
	} catch (e) {
		/** @typedef {{ code: number, message: string, data: Object }} AuthError */

		const err = /** @type {AuthError} */ (e);
		console.error(err);
		console.error(err.data);
		error(err.code ?? 500, err.message ?? 'Unknown error occurred.');
	}
	locals.blogPostsCache = locals.blogPostsCache.filter((p) => p.id !== id);
	redirect(303, '/blog');
};
