import 'vite-plugin-pwa/svelte';
import 'vite-plugin-pwa/info';
import 'vite-plugin-pwa/pwa-assets';
import 'vite-plugin-pwa/client';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	declare const __DATE__: string
	declare const __RELOAD_SW__: boolean
	namespace App {
		// interface Error {}
		interface Locals {
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
