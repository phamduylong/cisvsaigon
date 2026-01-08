import PocketBase from 'pocketbase';

const pb = new PocketBase('https://longph.pockethost.io/');

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	/**
	 * @typedef {import('$lib/types/types.js').ImageRecord} ImageRecord
	 */
	/** @type ImageRecord[] */
	const images = await pb.collection('images').getFullList();
	return {
		images
	};
}
