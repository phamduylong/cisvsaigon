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

		interface BlogPost {
			id: string;
			collectionId: string;
			collectionName: string;
			content: string;
			title: string;
			created: string;
			updated: string;
			expand: User;
		}

		interface Locals {
			pocketBase: PocketBase;
			user: User?;
			blogPostsCache: BlogPost[];
		}

		interface Error {
			message: string;
		}
	}
}

export {};
