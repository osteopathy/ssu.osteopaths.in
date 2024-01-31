<script lang="ts">
	import { Temporal } from 'temporal-polyfill';

	export let data;
	$: console.log(data);
</script>
<main class="w-full max-w-5xl flex flex-col gap-y-6 p-4">
<h2 class="text-2xl">Appointments</h2>
<div class="flex flex-col items-center gap-y-12">
	{#await data.appointments}
		... Loading
	{:then appointments}
		{#each appointments as appointment}
			{@const [hour, minute] = appointment.startTime.split(':').map((v) => +`${v}`)}
			{@const formattedEndAt = new Temporal.PlainTime(hour, minute)
				.add({
					minutes: +`${appointment.duration}`
				})
				.toLocaleString('en-us', {
					hour: '2-digit',
					minute: '2-digit',
					hourCycle: 'h24'
				})}
			<div>
				<div>
					{appointment.user?.name}
				</div>
				<span>{appointment.date}</span>
				<div>
					{appointment.startTime} - {formattedEndAt}
				</div>
			</div>
		{/each}
	{/await}
	<!-- svelte-ignore missing-declaration -->
	<!-- <a
		href=""
		class="flex items-center pl-4 pr-3 py-2 rounded-full w-max shadow-inner shadow-layer-5 border border-layer-6 group hover:scale-95 transition-all"
	>
		<ArrowLeftCircleIcon
			class="group-hover:translate-x-0.5 group-active:-translate-x-1 transition-transform "
		/>
		<span class="mr-2 ml-1 text-xl scale-105 transition-transform group-hover:scale-100 mt-0.5">
			Back
		</span>
	</a> -->
</div>
</main>