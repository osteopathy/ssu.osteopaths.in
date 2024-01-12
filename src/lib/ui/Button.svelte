<script lang="ts">
	import { cn } from '$lib';
	import { buttonVariants } from './button';
	import type { Variant, Size } from './button';
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Props = HTMLButtonAttributes & {
		children: Snippet;
		variant?: Variant;
		size?: Size;
	};

	let { children, variant, size, class: className, ...props } = $props<Props>();
</script>

<button type="button" class={cn(buttonVariants({ size, variant }), className)} {...props}>
	{@render children()}
</button>
