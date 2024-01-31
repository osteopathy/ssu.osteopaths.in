<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { uploadFile } from '../../../../(api)/image/upload';
	import ImageUpload from './image-uploader.svelte';
	import { toast } from 'svelte-sonner';
	import type { CreateUserSchema } from '$lib/db/schema';
	import UserForm from './user-form.svelte';
	import { page } from '$app/stores';
	// import UsernameDialog from '$lib/components/username-dialog.svelte';

	export let form: SuperValidated<CreateUserSchema>;
	export let data;
	let image = data.user?.image;
	async function syncImageUrl(image_url: string) {
		await fetch('/image', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ userId: data.user?.id, url: image_url })
		});

		// deleting the previous image from cloudinary
		const regex = /\/v\d+\/([^/]+)\.\w{3,4}$/;
		const getPublicIdFromUrl = (cloudinaryUrl: string) => {
			const match = cloudinaryUrl.match(regex);
			return match ? match[1] : null;
		};

		if (data.user?.image) {
			const publicID = getPublicIdFromUrl(data.user.image);
			toast.loading('Transforming Image!');
			if (publicID) {
				const res = await fetch('/image', {
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id: publicID })
				});
			} else {
				console.log('Maybe Google Profile Image');
			}
		}
	}
</script>

<main class="flex w-full max-w-5xl flex-col p-4">
	<div class="mb-12 flex flex-col items-start justify-between sm:flex-row">
		<h2 class="text-4xl mb-4 sm:mb-0">Your Profile</h2>
		<div class="flex">
			<Button size="responsive" href="/user/{data.user?.id}">Public View</Button>
			{#if data.user?.role === 'osteopath'}
				<div class="mr-4 border-r-2 px-2"></div>
				<Button variant="outline" size="responsive" href="/{data.username}" class="w-max">Osteopathy Profile</Button>
			{/if}
		</div>
	</div>
	<!-- <pre>{JSON.stringify(data.user)}</pre> -->
	<div class="flex flex-col items-center gap-8 sm:flex-row">
		<Avatar.Root class="size-20">
			<Avatar.Image src={image} alt="@" />
			<Avatar.Fallback>CN</Avatar.Fallback>
		</Avatar.Root>
		<ImageUpload
			on:handleUploadImage={async (e) => {
				image = e.detail;
				toast.loading('Uploading image');
				if (!image) {
					toast.error('No Image selected');
					return;
				}
				const file = await fetch(image)
					.then((r) => r.blob())
					.then((blobFile) => new File([blobFile], 'avatar', { type: blobFile.type }));

				if (!file) {
					toast.error('No file selected');
					return;
				}
				const fileName = file.name.split('.')[0] || '';
				const isImage = file.type.includes('image');
				const fileSizeInMB = file.size / (1024 * 1024); // Convert bytes to MB
				console.log(`File Size: ${fileSizeInMB}`);

				const limit = 2 * 1024 * 1024; // 2MB
				if (file.size > limit) {
					toast.error(
						`File size should be less than 2MB, size of your file is ${fileSizeInMB} in MBs`
					);
					return;
				}

				if (!isImage) {
					toast.error('Video is not supported');
					return;
				}

				const url = await uploadFile(file);
				if (url) {
					toast.success('Image uploaded Cloudinary');
					image = url;
					toast.loading('Syncing with Database');
					try {
						await syncImageUrl(url);
						toast.success('Successfully synced with Database');
					} catch (error) {
						toast.error('Something went wrong');
						console.log(error);
					}
				} else {
					toast.error('Something went wrong');
				}
			}}
			imageSrc={image}
		/>
	</div>
	<!-- <UsernameDialog /> -->
	<UserForm user={data.user} {form} userId={$page.params.id} />
</main>
