<script>
	import '../app.pcss';
  import Logo from "$lib/ui/Logo.svelte"
	let { children} = $props();
</script>

<header class=""></header>

{@render children()}

<footer
	class="w-full max-w-5xl mt-auto bg-layer-2 py-2 pl-2 pr-4 mb-10 flex flex-col shadow-md shadow-layer-6/30 rounded-xl"
>
	<div class="flex flex-col sm:flex-row items-center gap-y-4 mb-2 sm:mb-1 justify-between w-full">
		<div class="flex items-center gap-x-2">
			<Logo size={36} />
			<div class="whitespace-nowrap text-2xl font-semibold text-layer-12">V2O</div>
		</div>
		<div
			class="flex flex-wrap xs:flex-row items-center justify-center space-x-4 text-sm font-semibold leading-6 text-layer-11"
		>
			<a href="/privacy-policy" class="hover:underline">Privacy policy</a>
			<div class="h-4 w-px hidden xs:block bg-slate-500/20"></div>
			<a href="/term-of-service" class="hover:underline">Term of Service</a>
			<div class="h-4 w-px hidden xs:block bg-slate-500/20"></div>
			<a href="/contact-us" class="hover:underline">Contact Us</a>
		</div>
	</div>
	<span class="p-px mt-1 font-medium text-sm text-layer-9 text-center sm:text-left"
		>built with sveltekit, typescript,<br class="block xs:hidden" /> tailwindcss and tursodb</span
	>
</footer>
