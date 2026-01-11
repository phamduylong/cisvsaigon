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
