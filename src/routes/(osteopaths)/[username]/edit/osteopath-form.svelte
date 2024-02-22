<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea';
	import { formSchema, type FormSchema } from './schema';
	import { toast } from 'svelte-sonner';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		validators: zodClient(formSchema),
		onSubmit() {
			toast.info('Submitting...');
		},
		onResult({ result }) {
			if (result.status === 200) toast.success('Success!');
			if (result.status === 400) toast.error('Error!');
		}
	});

	const { form: formData, enhance } = form;

	$: selectedSessionDailyLimit = $formData.session_daily_limit
		? {
				label: `${$formData.session_daily_limit} sessions`,
				value: $formData.session_daily_limit
			}
		: undefined;
</script>

<form method="POST" use:enhance>
	<div class="rounded-md border p-4">
		<h2 class="mb-1 text-xl text-muted-foreground">Osteopath</h2>
		<Form.Field {form} name="about">
			<Form.Control let:attrs>
				<Form.Label>About</Form.Label>
				<Textarea
					{...attrs}
					placeholder="Tell us a little bit about yourself"
					class="resize-none"
					bind:value={$formData.about}
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="session_daily_limit">
			<Form.Control let:attrs>
				<Form.Label class="mr-4">Daily Limit</Form.Label>
				<Select.Root
					selected={selectedSessionDailyLimit}
					onSelectedChange={(v) => {
						v && ($formData.session_daily_limit = v.value);
					}}
				>
					<Select.Trigger {...attrs}>
						<Select.Value placeholder="Select a verified email to display" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value={1} label="1 sessions" />
						<Select.Item value={2} label="2 sessions" />
						<Select.Item value={3} label="3 sessions" />
						<Select.Item value={4} label="4 sessions" />
						<Select.Item value={5} label="5 sessions" />
						<Select.Item value={6} label="6 sessions" />
						<Select.Item value={7} label="7 sessions" />
					</Select.Content>
				</Select.Root>
                <input hidden bind:value={$formData.session_daily_limit} name={attrs.name} />
				<Form.Description>Maximum number of sessions you can give in a day.</Form.Description>
				<Form.FieldErrors />
			</Form.Control>
		</Form.Field>
		<Form.Field {form} name="session_location">
			<Form.Control let:attrs>
				<Form.Label>Location</Form.Label>
				<Textarea {...attrs} bind:value={$formData.session_location} />
				<Form.Description>Location where you give sessions.</Form.Description>
				<Form.FieldErrors />
			</Form.Control>
		</Form.Field>
        <Form.Button class="mt-4">Update</Form.Button>
	</div>
</form>
