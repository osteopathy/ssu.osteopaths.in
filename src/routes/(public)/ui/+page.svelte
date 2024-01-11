<script>
	import Button from "$lib/ui/Button.svelte"

	const style1 = `
      bg-layer-9 text-layer-1
      hover:bg-layer-10
      focus-visible:bg-layer-10 focus-visible:ring-layer-8 focus-visible:ring-offset-layer-0
      active:bg-layer-11
    `
</script>

<main class="min-h-screen flex items-center justify-center">
	<Button
		class="
      inline-flex items-center justify-center
      rounded-md px-2.5 py-1 transition-colors ease-in
      focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2
       select-none
      "
	>
		Click Me
	</Button>
</main>
