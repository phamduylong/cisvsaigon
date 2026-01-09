import { redirect } from '@sveltejs/kit';

export const POST = ({ locals }) => {
	locals.pocketBase.authStore.clear();
	locals.user = null;

	redirect(303, '/login');
};
