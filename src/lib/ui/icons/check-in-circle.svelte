<script lang="ts">
	import type { IconProps } from './icons.type';

	const { class: className = 'w-6 h-6', ...props } = $props<IconProps>();
</script>

<svg
	fill="none"
	shape-rendering="geometricPrecision"
	stroke="currentColor"
	stroke-linecap="round"
	stroke-linejoin="round"
	stroke-width="1.5"
	viewBox="0 0 24 24"
	{...props}
	class={className}
>
	<path
		d="M8 11.857l2.5 2.5L15.857 9M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"
	/>
</svg>
