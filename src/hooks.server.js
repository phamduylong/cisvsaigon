import PocketBase from 'pocketbase';
import { POCKETBASE_URL } from '$env/static/private';
export const handle = async ({ event, resolve }) => {
	event.locals.pocketBase = new PocketBase(POCKETBASE_URL);

	event.locals.pocketBase.authStore.loadFromCookie(event.request.headers.get('cookie') ?? '');

	try {
		if (event.locals.pocketBase.authStore.isValid) {
			await event.locals.pocketBase.collection('users').authRefresh();
			event.locals.user = event.locals.pocketBase.authStore.model;
		} else {
			event.locals.user = null;
		}
	} catch (err) {
		console.error('Error during PocketBase .authRefresh():', err);
		event.locals.pocketBase.authStore.clear();
		event.locals.user = null;
	}

	const response = await resolve(event);

	// Use headers.append so that it doesn't overwrite existing cookies for theme
	// See: https://github.com/remix-run/remix/issues/231
	response.headers.append(
		'set-cookie',
		event.locals.pocketBase.authStore.exportToCookie({ secure: false })
	);

	return response;
};
