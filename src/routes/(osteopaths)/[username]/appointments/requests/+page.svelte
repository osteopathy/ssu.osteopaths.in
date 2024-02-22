Requests
		<!-- {#each Object.keys(data.bydates) as date}
			<li class="bg-card-alt rounded-xl border p-6 shadow-inner shadow-muted/75">
				<h2 class="mb-4 text-2xl sm:text-3xl">{date}</h2>
				<ul class="flex flex-col gap-y-4">
					{#each data.bydates[date] as appointment}
						{@const [hour, minute] = appointment.startTime?.split(':').map((v) => +v)}
						{@const formattedStartTime = new Temporal.PlainTime(hour, minute).toLocaleString(
							'en-us',
							{
								hour: '2-digit',
								minute: '2-digit',
								hour12: false
							}
						)}
						{@const formattedEndAt = new Temporal.PlainTime(hour, minute)
							.add({
								minutes: +`${appointment.duration}`
							})
							.toLocaleString('en-us', {
								hour: '2-digit',
								minute: '2-digit',
								hour12: false
						})}
						<li class="bg-layer-3 mb-4 p-2">
							<div class="flex items-center gap-x-2">
								<h4>{appointment.user.name}</h4>
								<h4>{appointment.user.phoneNumber}</h4>
								<span class="flex items-center">
									{formattedStartTime}
									<Minus />
									{formattedEndAt}
								</span>
							</div>
						</li>
					{/each}
				</ul>
			</li>
		{/each} -->