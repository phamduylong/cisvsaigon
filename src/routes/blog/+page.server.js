import { error, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	/**
	 * @typedef {import('$lib/types/types.js').BlogPostRecord} BlogPostRecord
	 * @typedef {import('$lib/types/types.js').UserRecord} UserRecord
	 */
	/** @type {(BlogPostRecord & { expand: { author: UserRecord } })[]} */
	const posts = await locals.pocketBase.collection('posts').getFullList({
		sort: '-created',
		expand: 'author'
	});

	// store posts into cache
	locals.blogPostsCache = posts;

	return {
		posts
	};
}

export const actions = {
	create: async ({ locals, request }) => {
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
			error(err.code ?? 500, err.message ?? 'Unknown error occurred.');
		}

		redirect(303, '/blog');
	},

	delete: async ({ locals, request }) => {
		const body = Object.fromEntries(await request.formData());
		const id = body['id'];

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

		if (locals.blogPostsCache && locals.blogPostsCache.length) {
			locals.blogPostsCache = locals.blogPostsCache.filter((p) => p.id !== id);
		}

		redirect(303, '/blog');
	}
};
