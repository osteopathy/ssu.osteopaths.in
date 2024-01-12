<script lang="ts">
	import { Avatar } from "bits-ui"
	const {
		placeholder,
		src,
		alt,
		size = "default",
	} = $props<{
		placeholder: string
		src: string
		alt: string
		size?: keyof typeof styles
	}>()

	const styles = {
		xs: "size-6",
		sm: "size-8",
		default: "size-10",
		md: "size-12",
	}
</script>

<Avatar.Root
	class="{styles[
		size
	]} shrink-0 rounded-full bg-layer-6 text-[17px] font-medium uppercase text-layer-13"
>
	<div
		class="flex h-full w-full items-center justify-center rounded-full border border-layer-0"
	>
		<Avatar.Image class="rounded-full" {src} {alt} />
		<Avatar.Fallback>
			{placeholder}
		</Avatar.Fallback>
	</div>
</Avatar.Root>
