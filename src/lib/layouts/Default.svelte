<script lang="ts">
	export let title: string | null = null;
	export let description: string | null = null;
</script>

<svelte:head>
	<title>{title ? `${title} | ` : ''} Osteopathy</title>
	<meta
		name="description"
		content="A Svelte preprocessor that brings the power of Markdoc right into your Svelte applications!"
	/>
</svelte:head>

<main class="prose dark:prose-invert sm:prose-lg md:prose-xl relative w-full max-w-5xl">
	<h1>{title}</h1>
	<h3>{description}</h3>
	<slot />
</main>
