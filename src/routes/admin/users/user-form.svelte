<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { FormOptions } from 'formsnap';
	import { toast } from 'svelte-sonner';
	import { createUserSchema, type CreateUserSchema } from '$lib/db/schema'

	export let form: SuperValidated<CreateUserSchema>;

	export let formType: 'create-user' | 'update-user' = 'create-user';
	export let userId: string = '';

	const options: FormOptions<CreateUserSchema> = {
		onSubmit() {
			toast.info('Submitting...');
		},
		onResult({ result }) {
			if (result.status === 200) toast.success('Success!');
			if (result.status === 400) toast.error('Error!');
		}
	};
</script>

<Form.Root
	schema={createUserSchema}
	{form}
	{options}
	let:config
	method="POST"
	action="?/{formType}"
	class="space-y-6"
>
	{#if formType === 'update-user'}
		<Form.Field {config} name="id">
			<Form.Item>
				<Form.Label>User Id</Form.Label>
				<Form.Input readonly value={userId} class="bg-white dark:bg-slate-950" />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	{/if}
	<Form.Field {config} name="name">
		<Form.Item>
			<Form.Label>User Name</Form.Label>
			<Form.Input />
			<Form.Description>Name of the User Display over the Main Screen</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="gmail">
		<Form.Item>
			<Form.Label>User Gmail</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Button>{ formType === 'create-user' ? 'Submit' : 'Update'}</Form.Button>
	<Form.Button formmethod="dialog" variant="outline">Cancel</Form.Button>
</Form.Root>
