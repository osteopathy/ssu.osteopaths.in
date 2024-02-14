<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { FormOptions } from 'formsnap';
	import { toast } from 'svelte-sonner';
	import { createCourseSchema, type CreateCourseSchema } from '$lib/db/schema';

	export let form: SuperValidated<CreateCourseSchema>;

	export let formType: 'create-course' | 'update-course' = 'create-course';
	export let courseId: string = '';

	const options: FormOptions<CreateCourseSchema> = {
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
	schema={createCourseSchema}
	{form}
	{options}
	let:config
	method="POST"
	action="?/{formType}"
	class="space-y-6"
>
	<Form.Field {config} name="id">
		<Form.Item>
			<Form.Label>Course Id</Form.Label>
			<Form.Input value={courseId} />
			<Form.Description>This is similar to `bos`, `mos` & `ios`, pretty short</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="label">
		<Form.Item>
			<Form.Label>Course Name</Form.Label>
			<Form.Input />
			<Form.Description>Name of the Course Display over the Main Screen</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="description">
		<Form.Item>
			<Form.Label>Course Description</Form.Label>
			<Form.Textarea class="bg-white dark:bg-slate-950" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Button>{formType === 'create-course' ? 'Submit' : 'Update'}</Form.Button>
	<Form.Button formmethod="dialog" variant="outline">Cancel</Form.Button>
</Form.Root>
