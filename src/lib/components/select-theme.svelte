<script lang="ts">
	import { onMount } from "svelte";
	import { setMode } from "mode-watcher";

	let selectedMode: "light" | "dark" | "system" = "system";

	onMount(() => {
		const html = document.documentElement;
		const mode = html.getAttribute("data-mode");

		if (mode === "light" || mode === "dark" || mode === "system") {
			selectedMode = mode;
		} else if (html.classList.contains("dark")) {
			selectedMode = "dark";
		}
	});
</script>

<select
	class="bg-layer-3 hover:bg-layer-3 border-layer-6 hover:border-layer-7 rounded-md border py-1 pl-2 shadow-sm"
	bind:value={selectedMode}
	onchange={() => {
		setMode(selectedMode);
	}}
>
	<option value="light">Theme: Light</option>
	<option value="dark">Theme: Dark</option>
	<option value="system">Theme: System</option>
</select>
