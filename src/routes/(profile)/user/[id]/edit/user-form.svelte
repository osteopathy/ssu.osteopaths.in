<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { FormOptions } from 'formsnap';
	import { toast } from 'svelte-sonner';
	import { createUserSchema, type CreateUserSchema, type User } from '$lib/db/schema';

	export let form: SuperValidated<CreateUserSchema>;

	export let userId: string = '';
	export let user: User | null = null;

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
	action="/admin/users/?/update-user"
	class="space-y-6"
>
	<input type="hidden" name="id" value={userId} />
	<Form.Field {config} name="name">
		<Form.Item>
			<Form.Label>Full Name</Form.Label>
			<Form.Input required value={user?.name} />
			<Form.Description>Name of the User Display over the Main Screen</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="phoneNumber">
		<Form.Item>
			<Form.Label>Phone Number</Form.Label>
			<Form.Input value={user?.phoneNumber} />
			<Form.Description
				>Shared with the Osteopath with whom you are going to take future sessions</Form.Description
			>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Button>Update</Form.Button>
</Form.Root>
