<script lang="ts">
	import DatePicker from "./date-picker.svelte"
	import Avatar from "$lib/ui/Avatar.svelte"
	import { ArrowRightIcon } from "lucide-svelte"
	export let data
</script>

<section class="p-4 flex gap-4 w-full justify-between min-h-screen">
	<aside class="flex flex-col justify-between shrink-0">
		<ul class="">
			<li>
				<DatePicker size="sm" />
			</li>
			<li></li>
		</ul>
		<div
			class="flex items-center px-3 py-2 rounded-full shadow-inner shadow-layer-5 border border-layer-6 gap-x-2"
		>
			<Avatar placeholder={data.user.name[0] + data.user.name[1]} />
			<div class="flex flex-col grow w-0">
				<h3 class="text-lg/6 w-full">{data.user.name}</h3>
				<div class="-mt-1 text-sm flex items-center">
					<span class=""> view profile </span>
					<span> <ArrowRightIcon size={16} /> </span>
				</div>
			</div>
		</div>
	</aside>
	<main class="flex flex-col gap-4 flex-1">
		<h2>List of Osteopaths</h2>
		<div></div>
	</main>
	<!-- <div class="shrink w-64">Div</div> -->
</section>
