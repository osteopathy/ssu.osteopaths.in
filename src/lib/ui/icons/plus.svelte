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
	<path d="M12 5v14" /><path d="M5 12h14" />
</svg>
