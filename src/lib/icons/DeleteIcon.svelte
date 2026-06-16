<script lang="ts">
	import FluentDelete24Filled from "virtual:icons/fluent/delete-24-filled";
	import FluentDelete24Regular from "virtual:icons/fluent/delete-24-regular";

	type Props = {
		class?: string;
	};
	const { class: className, ...attrs }: Props = $props();
</script>

<span class="relative">
	<FluentDelete24Regular
		shape-rendering="geometricPrecision"
		class={`size-5 transition-[opacity,transform] duration-100 will-change-[opacity,transform] group-hover:scale-95 group-hover:opacity-0 group-hover:duration-300 group-focus-visible:scale-95 group-focus-visible:opacity-0 group-focus-visible:duration-300 group-aria-[current='page']:scale-95 group-aria-[current='page']:opacity-0 group-aria-[current='page']:duration-300` +
			" " +
			className}
		{...attrs}
	/>
	<FluentDelete24Filled
		shape-rendering="geometricPrecision"
		class={`absolute size-5 -translate-y-full scale-100 opacity-0 transition-[opacity,transform] duration-100 group-hover:scale-95 group-hover:opacity-100 group-focus-visible:scale-95  group-focus-visible:opacity-100 group-active:scale-90 group-aria-[current='page']:scale-95 group-aria-[current='page']:opacity-100` +
			" " +
			className}
		{...attrs}
	/>
</span>
