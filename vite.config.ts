import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'
import { defineConfig } from 'vite';

export default defineConfig({
	define: {
		__DATE__: `'${new Date().toISOString()}'`,
		__RELOAD_SW__: false,
		'process.env.NODE_ENV': process.env.NODE_ENV === 'production' ? '"production"' : '"development"',
	},
	plugins: [
		sveltekit(),
		SvelteKitPWA(
			{
				strategies: 'injectManifest',
				pwaAssets: {
					config: true
				},
				manifest: {
					short_name: 'V2O App',
					name: 'Osteopathy V2O App',
					description: 'A Online Platform for making it easy for people to find and book osteopathy appointments online.',
					theme_color: '#ffffff',
					background_color: '#ffffff',
					display: 'standalone',
					lang: 'en',
					orientation: 'portrait',
					scope: '/',
				},
				devOptions: {
					enabled: false,
					type: 'module',
					navigateFallback: '/',
				},
				kit: {
					includeVersionFile: true,
				},
})
	]
});