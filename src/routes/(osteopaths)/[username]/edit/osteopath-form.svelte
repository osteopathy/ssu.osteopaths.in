<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { FormOptions } from 'formsnap';
	import { toast } from 'svelte-sonner';
	import { formSchema, type FormSchema } from './schema';
	import { ArrowRight } from 'radix-icons-svelte';

	export let form: SuperValidated<FormSchema>;
	export let about = '';
	export let session_duration = 45;
	export let session_location = 'Shruti Building, 2nd Floor';
	export let session_daily_limit = 4;

	// key value pair for select options generate for duration
	const duration_options = new Map([
		['30', { label: '30 minutes', value: "30", disabled: false }],
		['45', { label: '45 minutes', value: "45", disabled: false }],
		['60', { label: '60 minutes', value: "60", disabled: false }]
	]);

	const limit_options = new Map([
		['1', { label: '1 session', value:"1", disabled: false }],
		['2', { label: '2 sessions', value:"2" , disabled: false }],
		['3', { label: '3 sessions', value:"3" , disabled: false }],
		['4', { label: '4 sessions', value:"4" , disabled: false }],
		['5', { label: '5 sessions', value:"5" , disabled: false }],
		['6', { label: '6 sessions', value:"6" , disabled: false }],
		['7', { label: '7 sessions', value:"7" , disabled: false }],
	]);

	let selected_duration = duration_options.get(session_duration.toString());
	let selected_limit = limit_options.get(session_daily_limit.toString());

	const options: FormOptions<FormSchema> = {
		onSubmit() {
			toast.info('Submitting...');
		},
		onResult({ result }) {
			if (result.status === 200) toast.success('Success!');
			if (result.status === 400) toast.error('Error!');
		},
	};
</script>

<Form.Root schema={formSchema} {form} {options} let:config method="POST">
	<div class="p-4 border rounded-md">
		<h2 class="text-muted-foreground text-xl mb-1">Session</h2>
		<Form.Field {config} name="session_daily_limit">
			<Form.Item>
				<Form.Label class="mr-4">Daily Limit</Form.Label>
				<Form.Select bind:selected={selected_limit}>
					<Form.SelectTrigger value={session_daily_limit} icon={ArrowRight} placeholder="Select Maximum" />
					<Form.SelectContent>
						{#each limit_options as [limit_value,limit]}
							<Form.SelectItem value={limit_value}>{limit.label}</Form.SelectItem>
						{/each}
					</Form.SelectContent>
				</Form.Select>
				<Form.Description>
					Maximum number of sessions you can give in a day.
				</Form.Description>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Field {config} name="session_duration">
			<Form.Item>
				<Form.Label class="mr-4">Duration</Form.Label>
				<Form.Select bind:selected={selected_duration}>
					<Form.SelectTrigger value={session_duration} placeholder="Select Total Time it takes to give one session" />
					<Form.SelectContent>
						{#each duration_options as [duration_value,duration]}
							<Form.SelectItem value={duration_value}>{duration.label}</Form.SelectItem>
						{/each}
					</Form.SelectContent>
				</Form.Select>
				<Form.Description>
					Total time it takes to give one session.
				</Form.Description>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Field {config} name="session_location">
			<Form.Item class="mt-4">
				<Form.Label>Location</Form.Label>
				<Form.Textarea value={session_location} />
				<Form.Description>
					Location where you give sessions.
				</Form.Description>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	</div>
	<div class="p-4 mt-8 border rounded-md">
		<h2 class="text-muted-foreground text-xl mb-1">Personal Details</h2>
	<Form.Field {config} name="about">
		<Form.Item>
			<Form.Label>About</Form.Label>
			<Form.Textarea value={about} />
			<Form.Description>Write few sentences about yourself.</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	</div>
	<Form.Button class="mt-4">Update</Form.Button>
</Form.Root>
