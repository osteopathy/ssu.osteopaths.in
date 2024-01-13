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
	<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
	<path d="M16 17l5-5-5-5" />
	<path d="M21 12H9" />
</svg>
