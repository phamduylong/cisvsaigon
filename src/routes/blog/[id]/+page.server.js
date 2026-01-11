import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params }) {
	if (!params.id) {
		error(400, 'Cannot load post with empty id');
	}

	if (locals.blogPostsCache && locals.blogPostsCache.length) {
		// we have cached posts, let's use that to look up the current post. It most likely is there
		/**
		 * @typedef {import('$lib/types/types.js').BlogPostRecord} BlogPostRecord
		 * @typedef {import('$lib/types/types.js').UserRecord} UserRecord
		 */
		const findResult = locals.blogPostsCache.find((_post) => _post.id === params.id);
		if (findResult) {
			return {
				findResult
			};
		}
	} else {
		// cache doesn't contains, a DB trip is needed
		const post = await locals.pocketBase
			.collection('posts')
			.getFirstListItem(`id = "${params.id}"`, {
				expand: 'author'
			});

		if (post) {
			return {
				post
			};
		} else {
			error(404, 'Invalid blog post id');
		}
	}
}
