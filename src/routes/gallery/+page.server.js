/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	/**
	 * @typedef {import('$lib/types/types.js').ImageRecord} ImageRecord
	 */
	/** @type ImageRecord[] */
	const images = await locals.pocketBase.collection('images').getFullList();
	return {
		images
	};
}
