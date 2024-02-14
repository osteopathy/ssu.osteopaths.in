<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { FormOptions } from 'formsnap';
	import { toast } from 'svelte-sonner';
	import { createOsteopathSchema, type Course, type CreateOsteopathSchema } from '$lib/db/schema';
	import Label from '$lib/components/ui/label/label.svelte';

	export let form: SuperValidated<CreateOsteopathSchema>;
	export let formType: 'create-osteopath' | 'update-osteopath' = 'create-osteopath';
	export let courses: Course[] = [];

	const options: FormOptions<CreateOsteopathSchema> = {
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
	schema={createOsteopathSchema}
	{form}
	{options}
	let:config
	method="POST"
	action="?/{formType}"
	class="space-y-6"
>
	<Form.Field {config} name="userId">
		<Form.Item>
			<Form.Label>User Id</Form.Label>
			<Form.Input />
			<Form.Description>
				This is the id of the user, you can find it in the Users Table!
			</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="batch">
		<Form.Item>
			<Form.Label>Batch</Form.Label>
			<Form.Input type="text" min={4} max={4} />
			<Form.Description>
				read as eg. <em>2021</em> batch <br />
			</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="username">
		<Form.Item>
			<Form.Label>Username</Form.Label>
			<Form.Input />
			<Form.Description>
				osteopaths.in/osteopaths/<strong>username</strong>
			</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="courseId">
		<Form.Item class="space-y-3">
			<Form.Label>Select A Course</Form.Label>
			<Form.RadioGroup class="flex flex-col space-y-1">
				{#each courses as course}
					<Form.Item class="flex items-center space-x-3 space-y-0">
						<Form.RadioItem value={course.id} id={course.id} />
						<Label for={course.id} class="font-normal">{course.label}</Label>
					</Form.Item>
				{/each}
			</Form.RadioGroup>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Button>{formType === 'create-osteopath' ? 'Submit' : 'Update'}</Form.Button>
	<Form.Button formmethod="dialog" variant="outline">Cancel</Form.Button>
</Form.Root>
