import { error, redirect } from '@sveltejs/kit';
/**
 * @typedef {import('$lib/types/types.js').BlogPostRecord} BlogPostRecord
 * @typedef {import('$lib/types/types.js').UserRecord} UserRecord
 */

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
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

		const title = String(body['title']);

		const content = String(body['postContent']);

		const user = locals.user;

		if (!title) {
			error(400, 'Post must have a title');
		}

		if (!content || !content.replaceAll('<p>', '').replaceAll('</p>', '').trim()) {
			error(400, 'Post must not be empty');
		}

		/** @type {(BlogPostRecord & { expand: { author: UserRecord } }) | null} */
		let post = null;

		try {
			post = await locals.pocketBase.collection('posts').create({
				title,
				content,
				author: user?.id
			});
		} catch (e) {
			/**
			 * @typedef {import('$lib/types/types.js').PocketBaseClientError} PocketBaseClientError
			 */
			const err = /** @type {PocketBaseClientError} */ (e);
			console.error(err.originalError);

			/** @type {string[]} */
			const errMessages = [];
			Object.values(err.originalError.data.data).forEach((err) => {
				errMessages.push(err.message);
			});

			error(
				err.originalError.data.code ?? 500,
				errMessages.join('\n') ?? 'Unknown error occurred.'
			);
		}

		redirect(303, `/blog/${post?.id}`);
	},

	delete: async ({ locals, request }) => {
		const body = Object.fromEntries(await request.formData());
		const id = body['id'];

		if (!id) error(400, 'Attempted to delete post with invalid id');

		try {
			await locals.pocketBase.collection('posts').delete(id);
		} catch (e) {
			/**
			 * @typedef {import('$lib/types/types.js').PocketBaseClientError} PocketBaseClientError
			 */
			const err = /** @type {PocketBaseClientError} */ (e);
			console.error(err.originalError);

			/** @type {string[]} */
			const errMessages = [];
			Object.values(err.originalError.data.data).forEach((err) => {
				errMessages.push(err.message);
			});

			error(
				err.originalError.data.code ?? 500,
				errMessages.join('\n') ?? 'Unknown error occurred.'
			);
		}

		if (locals.blogPostsCache && locals.blogPostsCache.length) {
			locals.blogPostsCache = locals.blogPostsCache.filter((p) => p.id !== id);
		}

		redirect(303, '/blog');
	}
};
