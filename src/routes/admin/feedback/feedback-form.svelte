<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { FormOptions } from 'formsnap';
	import { toast } from 'svelte-sonner';
	import { createFeedbackSchema, type CreateFeedbackSchema } from '$lib/db/schema';
	import Label from '$lib/components/ui/label/label.svelte';

	export let form: SuperValidated<CreateFeedbackSchema>;

	export let formType: 'create-feedback' | 'update-feedback' = 'create-feedback';
	export let feedbackId: string = '';

	const options: FormOptions<CreateFeedbackSchema> = {
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
	schema={createFeedbackSchema}
	{form}
	{options}
	let:config
	method="POST"
	action="?/{formType}"
	class="space-y-6"
>
	{#if formType === 'update-feedback'}
		<Form.Field {config} name="id">
			<Form.Item>
				<Form.Label>Feedback Id</Form.Label>
				<Form.Input value={feedbackId} />
				<Form.Description>This is similar to `issue`, `mos` & `ios`, pretty short</Form.Description>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	{:else}
		<Form.Field {config} name="userId">
			<Form.Item>
				<Form.Label>User Id</Form.Label>
				<Form.Input />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	{/if}
	<Form.Field {config} name="content">
		<Form.Item>
			<Form.Label>Feedback Description</Form.Label>
			<Form.Textarea class="bg-white dark:bg-slate-950" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="category">
		<Form.Item class="space-y-3">
			<Form.Label>Select A Category</Form.Label>
			<Form.RadioGroup class="flex flex-row gap-x-2">
				{#each ['issue', 'idea', 'other'] as option}
					<Form.Item class="flex items-center space-x-3 space-y-0">
						<Form.RadioItem value={option} id={option} />
						<Label for={option} class="font-normal">{option}</Label>
					</Form.Item>
				{/each}
			</Form.RadioGroup>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Button type="submit">{formType === 'create-feedback' ? 'Submit' : 'Update'}</Form.Button>
	<Form.Button formmethod="dialog" variant="outline">Cancel</Form.Button>
</Form.Root>
