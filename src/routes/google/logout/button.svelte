<script lang="ts">
	import { enhance } from '$app/forms';
	import { LogOutIcon } from '$lib/ui/icons';
	import { cn } from '$lib';
	let { label, class: className, ...props } = $props<{ label: string; class?: string }>();
</script>

<form method="post" action="/google/logout" use:enhance>
	<button
		type="submit"
		class={cn(
			'inline-flex justify-start px-3 py-2 bg-red-500/20 text-red-600 rounded-full gap-x-2 w-full',
			className
		)}
		{...props}
	>
		<span><LogOutIcon class="w-5 h-5" /></span>
		<span class="text-sm">{label}</span>
	</button>
</form>
