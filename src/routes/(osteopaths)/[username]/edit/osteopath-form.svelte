<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { FormOptions } from 'formsnap';
	import { toast } from 'svelte-sonner';
	import { formSchema, type FormSchema } from './schema';

	export let form: SuperValidated<FormSchema>;
	export let about = '';
	const options: FormOptions<FormSchema> = {
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
	schema={formSchema}
	{form}
	{options}
	let:config
	method="POST"
>
	<Form.Field {config} name="about">
		<Form.Item>
			<Form.Label>About</Form.Label>
			<Form.Textarea value={about} />
			<Form.Description>Write few sentences about yourself.</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Button>Update</Form.Button>
</Form.Root>
