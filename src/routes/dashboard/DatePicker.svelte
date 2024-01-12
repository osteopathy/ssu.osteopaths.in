<script lang="ts">
	import { Temporal } from "@js-temporal/polyfill"
	import { untrack } from "svelte"
	const today = Temporal.Now.plainDateISO()
	let selected = $state(
		new Temporal.PlainDate(today.year, today.month, today.day)
	)

	const days = [
		"sunday",
		"monday",
		"tuesday",
		"wednesday",
		"thursday",
		"friday",
		"saturday",
	]

	let view = $state({
		weeks: [[], [], [], [], [], []],
		date: new Temporal.PlainYearMonth(
			untrack(() => selected.year),
			untrack(() => selected.month)
		),
	} as {
		weeks: Temporal.PlainDate[][]
		date: Temporal.PlainYearMonth
	})

	let header = $derived(
		new Temporal.PlainDate(view.date.year, view.date.month, 1).toLocaleString(
			"en-us",
			{
				month: "long",
				year: "numeric",
			}
		)
	)

	let firstDayOfMonth: Temporal.PlainDate = $derived(
		new Temporal.PlainDate(view.date.year, view.date.month, 1)
	)

	const getStartingPoint = () =>
		firstDayOfMonth.dayOfWeek === 7
			? new Temporal.PlainDate(view.date.year, view.date.month, 1)
			: new Temporal.PlainDate(view.date.year, view.date.month, 1).subtract({
					days: firstDayOfMonth.dayOfWeek,
			  })

	const invalidateAll = () => {
		let starting_point = getStartingPoint()
		if (view.weeks[0][0] === undefined) {
			let weeks: Temporal.PlainDate[][] = [[], [], [], [], [], [], []]
			for (let week = 0; week < 6; week++) {
				for (let index = 0; index < 7; index++) {
					weeks[week]?.push(starting_point)
					starting_point = starting_point.add({ days: 1 })
				}
			}
			view.weeks = weeks
		} else {
			for (let week = 0; week < 6; week++) {
				for (let index = 0; index < 7; index++) {
					view.weeks[week][index] = starting_point
					starting_point = starting_point.add({ days: 1 })
				}
			}
		}
	}
	invalidateAll()

	let { size = "sm" } = $props<{ size?: "default" | "lg" | "sm" }>()

	const styles = {
		container: {
			sm: "px-1.5 pt-1 pb-0.5 gap-y-1 w-56",
			default: "px-2 pt-1.5 pb-1 gap-y-1.5 w-64",
			lg: "px-3 pt-2 pb-1 gap-y-2 w-72",
		},
		headerLabel: {
			sm: "text-sm",
			default: "text-base",
			lg: "text-lg",
		},
		arrow: {
			sm: "w-5 h-5",
			default: "w-5 h-5",
			lg: "w-6 h-6",
		},
		cell: {
			header: {
				sm: "text-sm",
				default: "text-sm",
				lg: "text-base",
			},
			gap: {
				sm: "gap-1",
				default: "gap-1",
				lg: "gap-2",
			},
			text: {
				sm: "text-sm",
				default: "text-sm",
				lg: "text-base",
			},
		},
	} as const
</script>

<div
	class="border rounded-md border-layer-4 flex flex-col {styles['container'][
		size
	]}"
>
	<div class="flex items-center text-gray-900">
		<div
			class="flex-auto text-layer-12 font-semibold {styles['headerLabel'][
				size
			]}"
		>
			{header}
		</div>
		<button
			on:click={() => {
				view.date = view.date.subtract({
					months: 1,
				})
				invalidateAll()
			}}
			type="button"
			class="mr-2 bg-layer-2 hover:bg-layer-3 rounded-md flex flex-none items-center justify-center text-layer-11 hover:text-layer-13"
		>
			<span class="sr-only">Previous month</span>
			<svg
				class={styles["arrow"][size]}
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
			>
				<path
					fill-rule="evenodd"
					d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
		<button
			type="button"
			on:click={() => {
				view.date = view.date.add({
					months: 1,
				})
				invalidateAll()
			}}
			class="bg-layer-2 hover:bg-layer-3 rounded-md flex flex-none items-center justify-center text-layer-11 hover:text-layer-13"
		>
			<span class="sr-only">Next month</span>
			<svg
				class={styles["arrow"][size]}
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
			>
				<path
					fill-rule="evenodd"
					d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
	</div>
	<div role="grid" class="flex flex-col gap-y-1">
		<div
			role="row"
			class="grid grid-cols-7 place-items-center text-gray-500 {styles['cell'][
				'header'
			][size]} {styles['cell']['gap'][size]}"
		>
			{#each days as day}
				<div role="columnheader" class="leading-6">
					{(day[0] + day[1]).toUpperCase()}
				</div>
			{/each}
		</div>
		<div
			role="rowgroup"
			class="w-full flex flex-col {styles['cell']['gap'][size]}"
		>
			{#each view.weeks as week}
				<div role="row" class="grid grid-cols-7 {styles['cell']['gap'][size]}">
					{#each week as day}
						<button
							type="button"
							role="gridcell"
							aria-selected={selected.equals(day)}
							on:click={() => {
								selected = day
							}}
							class="flex items-center rounded-md justify-center hover:bg-layer-3 aspect-square bg-layer-2 aria-selected:bg-blue-600 aria-selected:text-layer-0 {styles[
								'cell'
							]['text'][size]}"
						>
							<time datetime={day.toString()}>
								{day.toLocaleString("en-us", { day: "2-digit" })}
							</time>
						</button>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>
