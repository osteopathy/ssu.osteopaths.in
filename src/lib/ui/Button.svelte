<script lang="ts">
	let { children, ...props } = $props();
</script>

<button type="button" {...props}>
	{@render children()}
</button>
