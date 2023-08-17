// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			code: number;
			message: string;
		}
		interface Locals {
			user: any;
			accessToken: string | undefined;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
