<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { fromDateStr, fromTimeStr } from '../../utils';
	import ordinal from 'ordinal';
	import groupBy from 'just-group-by';
	import { Minus } from 'radix-icons-svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<ul>
	{#each Object.keys(data.appointments) as date}
		{@const plainDate = fromDateStr(date)}
		{@const byTime = groupBy(data.appointments[date], (a) => a.startTime ?? '00:00')}
		<li class="border-b-2">
			<h3 class="bg-layer-3 flex items-center gap-x-1 px-2 pb-1">
				<span>{ordinal(plainDate.day)}{', '}</span>
				<span>{plainDate.toLocaleString('en-us', { month: 'long' })}</span>
				<span>{plainDate.toLocaleString('en-us', { year: 'numeric' })}</span>
			</h3>
			<ul class="bg-layer-2">
				{#each Object.keys(byTime) as time}
					{@const plainTime = fromTimeStr(time)}
					{@const confirmed = byTime[time].find((a) => a.status === 'confirmed')}
					<li class="flex gap-x-4 border-t px-3 py-4 tabular-nums">
						<h3 class="flex items-start">
							<span class="flex items-center">
								{plainTime.toLocaleString('en-us', {
									hour: '2-digit',
									minute: '2-digit',
									hour12: false
								})}
								<Minus />
								{plainTime.add({ minutes: 30 }).toLocaleString('en-us', {
									hour: '2-digit',
									minute: '2-digit',
									hour12: false
								})}
							</span>
						</h3>
						<ul class="flex w-max flex-col gap-y-6">
							{#if confirmed}
								<li class="flex w-full items-center gap-x-2">
									<Avatar.Root>
										<Avatar.Image
											src={confirmed.osteopath.user?.image}
											alt={confirmed.osteopath.user?.name}
										/>
										<Avatar.Fallback>CN</Avatar.Fallback>
									</Avatar.Root>
									<span>{confirmed.osteopath.user?.name}</span>
									<span>{confirmed.osteopath.user?.phoneNumber}</span>
									<span class="text-green-500">Confirmed</span>
								</li>
							{:else}
								{#each byTime[time] as appointment}
									<li class="flex w-full items-center gap-x-2">
										<Avatar.Root>
											<Avatar.Image
												src={appointment.osteopath.user?.image}
												alt={appointment.osteopath.user?.name}
											/>
											<Avatar.Fallback>CN</Avatar.Fallback>
										</Avatar.Root>
										<span>{appointment.osteopath.user?.name}</span>
										<span>{appointment.osteopath.user?.phoneNumber}</span>
										<span class="text-amber-500">Pending</span>
									</li>
								{/each}
							{/if}
						</ul>
					</li>
				{/each}
			</ul>
		</li>
	{/each}
</ul>
