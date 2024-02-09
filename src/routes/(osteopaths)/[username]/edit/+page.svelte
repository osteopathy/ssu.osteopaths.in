<script lang="ts">
	import type { SuperValidated } from "sveltekit-superforms";
	import OsteopathForm from "./osteopath-form.svelte";
	import type { FormSchema } from "./schema";
	import Button from "$lib/components/ui/button/button.svelte";
	import Google from "$lib/components/ui/icons/google.svelte";

    export let form: SuperValidated<FormSchema>;
    export let data;
</script>

<main class="w-full max-w-5xl p-4">
    <div class="mb-12 flex flex-col items-start justify-between sm:flex-row">
		<h2 class="text-4xl mb-4 sm:mb-0">Your Settings</h2>
		<div class="flex">
			<Button size="responsive" href="/{data.osteopath?.username}">Public View</Button>
			{#if data.user?.role === 'osteopath'}
				<div class="mr-4 border-r-2 px-2"></div>
				<Button variant="outline" size="responsive" href="/user/{data.user.id}/edit" class="w-max">Edit Profile</Button>
			{/if}
		</div>
	</div>
    <OsteopathForm session_daily_limit={data.osteopath?.session?.daily_limit} session_duration={data.osteopath?.session?.duration} session_location={data.osteopath?.session?.location} about={data.osteopath?.about ?? ''} form={form} />
	<div class="p-4 mt-8 border rounded-md flex flex-col gap-y-4">
		<div>
			<h2 class="text-muted-foreground text-xl mb-1">Username</h2>
			<p class="text-foreground text-sm">Your username is {data.osteopath.username}</p>
		</div>
		<div>
		<h2 class="text-muted-foreground text-xl mb-1">Calendar</h2>
		{#if data.calendar}
			<span>{data.calendar.gmail}</span>
			<!-- <a href="/calendar/disconnect" class="text-primary-foreground">Disconnect your calendar</a> -->
		{:else}
			<p class="text-foreground mb-2 text-sm">You can connect your calendar to your account to manage your availability and appointments.</p>
			<Button size="responsive" variant="default" href="/google/login?calendar=true">Connect Google Calendar</Button>
		{/if}
		</div>
	</div>
</main>
