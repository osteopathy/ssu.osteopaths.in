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
	<circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="M8 12h8" />
</svg>
