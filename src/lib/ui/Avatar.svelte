<script lang="ts">
	import { onMount } from "svelte"
	const {
		placeholder,
		src,
		alt,
		size = "default",
	} = $props<{
		src: string
		alt: string
		size: keyof typeof styles
		placeholder?: string
	}>()

	let loading = $state<"loading" | "loaded" | "error">("loading")

	onMount(() => {
		const image = new Image()
		image.src = src
		image.onload = () => {
			loading = "loaded"
		}
		image.onerror = () => {
			loading = "error"
		}
	})

	const styles = {
		xs: "size-6",
		sm: "size-8",
		default: "size-10",
		md: "size-12",
	}
</script>

<div class="{styles[size]} rounded-full border {loading === 'loaded'}">
	<div class="flex h-full w-full items-center justify-center rounded-full">
		<img class:hidden={loading === "loading"} {src} {alt} />
		{#if placeholder}
			<span
				class:block={loading === "loading"}
				class:hidden={loading === "loaded"}
				class="text-[17px] font-medium uppercase">{placeholder}</span
			>
		{:else}
			<span class="grow overflow-hidden rounded-full bg-gray-100">
				<svg
					class="h-full w-full text-gray-300"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
					/>
				</svg>
			</span>
		{/if}
	</div>
</div>
