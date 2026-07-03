import { SvelteKitPWA } from "@vite-pwa/sveltekit";
import tailwindcss from "@tailwindcss/vite";
import icon from "unplugin-icons/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { kitRoutes } from 'vite-plugin-kit-routes';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		kitRoutes({
			generated_file_path: 'src/lib/routes_helper.ts'
		}),
		icon({
			autoInstall: true,
			compiler: "svelte",
		}),
		SvelteKitPWA({
			strategies: "generateSW",
			// srcDir: "src",
			// filename: "service-worker.ts",
			registerType: "autoUpdate",
			// injectRegister: false,

			pwaAssets: {
				disabled: false,
				config: true
			},

			manifest: {
				name: "ssu-osteopath-in",
				short_name: "ssu-osteopath-in",
				description: "It is a web application that helps you find the best osteopath near you.",
				theme_color: "#4f39f6"
			},

			injectManifest: { globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,webmanifest}', 'prerendered/**/*.{html,json}'] },

			devOptions: {
				enabled: false,
				suppressWarnings: true,
				navigateFallback: "/",
				navigateFallbackAllowlist: [/^\/$/],
				type: "module"
			}
		})
	]
});
