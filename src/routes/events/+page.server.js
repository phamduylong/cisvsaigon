/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	/**
	 * @typedef {import('$lib/types/types.js').EventRecord} EventRecord
	 */
	/** @type {EventRecord[]} */
	const events = await locals.pocketBase.collection('events').getFullList({
		sort: '-startDate'
	});

	return {
		events
	};
}
