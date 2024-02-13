import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { markdoc } from 'svelte-markdoc-preprocess';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

function absoulute(file) {
	return join(dirname(fileURLToPath(import.meta.url)), file);
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    preprocess: [
		vitePreprocess({}),
		markdoc({
			layouts: {
				default: absoulute('./src/lib/layouts/Default.svelte')
			}
		})
	],
	extensions: ['.markdoc', '.svelte'],

    kit: {
        // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
        // If your environment is not supported or you settled on a specific environment, switch out the adapter.
        // See https://kit.svelte.dev/docs/adapters for more information about adapters.
        adapter: adapter()
    },
    alias: {
        // an alias ending /* will only match
        // the contents of a directory, not the directory itself
        '$api': 'src/routes/(api)/*'
    }
};

export default config;
