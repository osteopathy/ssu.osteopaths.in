<script lang="ts">
	import AvailabilitySlot from './AvailabilitySlot.svelte';
	import { config } from './utils';
	import type { PageServerData } from './$types';
	const days = [
		'sunday',
		'monday',
		'tuesday',
		'wednesday',
		'thursday',
		'friday',
		'saturday'
	] as const;

	let { availabilities } = $props<{
		availabilities: PageServerData['availabilities'];
	}>();
</script>

<ul class="flex flex-col gap-y-4 grow w-0 min-w-full">
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
