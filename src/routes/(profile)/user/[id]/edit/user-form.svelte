<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { createUserSchema, type CreateUserSchema } from '$lib/db/sqlite/schema';
	import { toast } from 'svelte-sonner';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<CreateUserSchema>>;

	const form = superForm(data, {
		validators: zodClient(createUserSchema),
        onSubmit() {
			toast.info('Submitting...');
		},
		onResult({ result }) {
			if (result.status === 200) toast.success('Success!');
			if (result.status === 400) toast.error('Error!');
		}
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" action="/user/actions/?/update-user" use:enhance>
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input {...attrs} bind:value={$formData.name} />
		</Form.Control>
		<Form.Description>This is your public display name.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="phoneNumber">
		<Form.Control let:attrs>
			<Form.Label>Phone Number</Form.Label>
			<Input {...attrs} bind:value={$formData.phoneNumber} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="mt-4">Update</Form.Button>
</form>
