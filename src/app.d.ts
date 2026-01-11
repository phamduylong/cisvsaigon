// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface User {
			collectionId: string;
			collectionName: string;
			created: string;
			email: string;
			emailVisibility: boolean;
			id: string;
			updated: string;
			username: string;
			verified: boolean;
			displayName: string;
			avatar: string;
		}

		interface Locals {
			pocketBase: PocketBase;
			user: User?;
		}

		interface Error {
			message: string;
		}
	}
}

export {};
