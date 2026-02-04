import { error, redirect } from '@sveltejs/kit';
import { isValidHttpUrl } from '$lib/helper/stringFunctions';

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

export const actions = {
	create: async ({ locals, request }) => {
		if (!locals.pocketBase.authStore.isValid) {
			error(401, 'Only authorized users can add new blog posts');
		}

		/**
		 * @type {string[]}
		 */
		const errors = [];

		const body = Object.fromEntries(await request.formData());

		const title = body['title'];

		if (!title) {
			errors.push('Event title is missing');
		}

		const _startDate = String(body['startDate']);
		const _endDate = String(body['endDate']);

		if (!_startDate) {
			errors.push('Start date is missing or malformed');
		}

		if (!_endDate) {
			errors.push('End date is missing or malformed');
		}

		const startDate = new Date(_startDate);
		const endDate = new Date(_endDate);

		if (endDate <= startDate) {
			errors.push('Ending date and time must be after start date and time');
		}

		const registrationLink = String(body['registrationLink']);

		if (registrationLink && !isValidHttpUrl(registrationLink)) {
			errors.push('Registration link is not a valid URL');
		}

		const minAge = Number(body['minAge']);

		const maxAge = Number(body['maxAge']);

		if (maxAge > 0 && minAge > maxAge) {
			errors.push('Minimum age to attend the event cannot be bigger than maximum age');
		}

		const shortDescription = body['shortDescription'];

		if (!shortDescription) {
			errors.push('Short description text for the event is missing');
		}

		if (errors.length) {
			error(400, `Invalid data:\n${errors.join('\n')}`);
		}

		try {
			await locals.pocketBase.collection('events').create({
				title,
				startDate,
				endDate,
				registrationLink,
				minAge,
				maxAge,
				shortDescription
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

		redirect(303, '/events');
	},

	delete: async ({ locals, request }) => {
		const body = Object.fromEntries(await request.formData());
		const id = body['id'];

		if (!id) error(400, 'Attempted to delete post with invalid id');

		try {
			await locals.pocketBase.collection('events').delete(id);
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
		redirect(303, '/events');
	}
};
