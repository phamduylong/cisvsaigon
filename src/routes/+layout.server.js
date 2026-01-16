export const prerender = true;

export const load = ({ locals }) => {
	// if we have an authenticated user, pass it over so the client side knows
	if (locals.user) {
		return {
			user: locals.user
		};
	}

	return {
		user: undefined
	};
};
