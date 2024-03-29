<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from '$lib/components/ui/button/button.svelte';
	import { fromDateStr, fromTimeStr } from '../../utils';
	import ordinal from 'ordinal';
	import groupBy from 'just-group-by';
	import { Minus } from 'radix-icons-svelte';
	import { appointment as api } from '../../../../(api)/api/v1/appointment';
	import { toast } from 'svelte-sonner';
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
						<ul class="flex w-max flex-col gap-y-8">
							{#if confirmed}
								<li class="flex flex-col items-start sm:flex-row sm:gap-x-2 sm:items-center w-full">
									<Avatar.Root>
										<Avatar.Image src={confirmed.user?.image} alt={confirmed.user?.name} />
										<Avatar.Fallback>CN</Avatar.Fallback>
									</Avatar.Root>
									<span class="my-1">{confirmed.user?.name}</span>
									<span>{confirmed.user?.phoneNumber}</span>
									<span class="text-green-500">Confirmed</span>
								</li>
							{:else}
								{#each byTime[time] as appointment}
									<li class="flex flex-col items-start sm:flex-row sm:gap-x-2 sm:items-center w-full">
										<Avatar.Root>
											<Avatar.Image src={appointment.user?.image} alt={appointment.user?.name} />
											<Avatar.Fallback>CN</Avatar.Fallback>
										</Avatar.Root>
										<span class="my-1">{appointment.user?.name}</span>
										<span>{appointment.user?.phoneNumber}</span>
										<Button
											on:click={async () => {
												toast.loading('Accepting appointment');
												await api.put(appointment.id, { status: 'confirmed' });
												toast.info('Appointment accepted');
												toast.loading('Cancelling other appointments');
												await Promise.allSettled(
													byTime[time].map((a) => {
														if (a.id !== appointment.id) {
															return api.put(a.id, { status: 'cancelled' });
														}
													})
												);
												data.appointments[date] = data.appointments[date].map((a) => {
													if (a.startTime === time)
														return {
															...a,
															status: a.id === appointment.id ? 'confirmed' : 'cancelled'
														};
													else return a;
												});
												toast.success('Other appointments cancelled');
											}}
											size="sm"
											class="mt-2 sm:ml-auto"
										>
											Accept
										</Button>
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
