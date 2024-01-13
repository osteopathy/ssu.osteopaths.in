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
	<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
	<path d="M16 2v4" />
	<path d="M8 2v4" />
	<path d="M3 10h18" />
</svg>
