<script lang="ts">
	import DatePicker from "./date-picker.svelte"
	import Avatar from "$lib/ui/Avatar.svelte"
	import LogoutButton from "../google/logout/button.svelte"
	import { ArrowRightIcon, CheckCheckIcon } from "lucide-svelte"
	import { cn } from "$lib"
	import { Temporal } from "@js-temporal/polyfill"
	const { data } = $props()
	const startAt = new Temporal.PlainTime(9)

	let menu = {
		morning:{
			startAt,
			endAt: startAt.add({
				hours: 2,
			}),
		},
		afternoon: {
			startAt: startAt.add({
				hours: 2,
			}),
			endAt: startAt.add({
				hours: 5,
			}),
		},
		evening: {
			startAt: startAt.add({
				hours: 5,
			}),
			endAt: startAt.add({
				hours: 9,
			}),
		},
  } as const;
	let selected = $state<Record<string, boolean>>({})
</script>

<section class="p-4 flex gap-4 w-full justify-between min-h-screen">
	<aside class="flex flex-col justify-between shrink-0">
		<ul class="flex flex-col gap-y-4">
			<li>
				<DatePicker size="sm" />
			</li>
			<li class="flex flex-col items-start gap-y-2 mt-3">
				{#each Object.keys(menu) as label, i (label)}
					<button
						class={cn(
							"flex items-center border border-layer-7 rounded-lg px-1.5 py-1 w-full justify-between gap-x-3 text-sm",
							selected[label] ? "text-layer-13" : "text-layer-8"
						)}
						on:click={() => {
							selected[label] = !selected[label]
						}}
					>
						<div class="flex gap-x-2">
							<CheckCheckIcon
								size={20}
								class={cn(
									selected[label] ? "text-blue-600" : "text-layer-8"
								)}
							/>
							<span>{label}</span>
						</div>
						<div class="flex gap-x-2">
							<span
								>{menu[label as keyof typeof menu].startAt.toLocaleString("en", {
									hour: "numeric",
								})}</span
							>
							<span>to</span>
							<span
								>{menu[label as keyof typeof menu].endAt.toLocaleString("en", {
									hour: "numeric",
								})}</span
							>
						</div>
					</button>
				{/each}
			</li>
		</ul>
		<div class="flex flex-col gap-y-4">
			<button
				class="flex items-center font-medium text-left px-3 py-2 rounded-full shadow-inner shadow-layer-5 border border-layer-6 gap-x-2"
			>
				<Avatar
					src={data.user.image}
					alt="@{data.user.name}"
					placeholder={data.user.name[0] + data.user.name[1]}
				/>
				<div class="flex flex-col grow w-0">
					<h3 class="text-lg/6 w-full">{data.user.name}</h3>
					<div class="-mt-1 text-sm flex items-center">
						<span class=""> view profile </span>
						<span> <ArrowRightIcon size={16} /> </span>
					</div>
				</div>
			</button>
			<LogoutButton class="w-max pr-3" label="Logout" />
		</div>
	</aside>
	<main class="flex flex-col gap-4 flex-1">
		<h2>List of Osteopaths</h2>
		<div></div>
	</main>
	<!-- <div class="shrink w-64">Div</div> -->
</section>
