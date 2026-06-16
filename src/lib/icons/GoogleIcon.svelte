<script lang="ts">
	import LogosGoogleIcon from "virtual:icons/logos/google-icon";

	type Props = {
		class?: string;
	};
	const { class: className, ...attrs }: Props = $props();
</script>

<LogosGoogleIcon
	shape-rendering="geometricPrecision"
	class={"size-6 transition-transform group-hover:scale-105 group-active:scale-100" +
		" " +
		className}
	{...attrs}
/>
