<script lang="ts">
	import AvailabilitySlot from './availability-slot.svelte';
	import { config } from './utils';
	// import type { LayoutServerData } from '../$types';
	const days = [
		'sunday',
		'monday',
		'tuesday',
		'wednesday',
		'thursday',
		'friday',
		'saturday'
	] as const;

	export let availabilities: any = [];
</script>

<ul class="flex w-0 min-w-full grow flex-col gap-y-4">
	{#each days as day}
		<li class="">
			<h3 class="mb-2">Availability {day}</h3>
			<AvailabilitySlot
				{day}
				markedPointers={availabilities && availabilities[day]
					? availabilities[day].map((e) => ({ ...e, element: null }))
					: []}
				startTime={config.startTime}
				endTime={config.endTime}
				minGap={config.minGap}
			/>
		</li>
	{/each}
</ul>
