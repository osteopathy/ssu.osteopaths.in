<script lang="ts">
	import { toast } from 'svelte-sonner';
	import UserForm from '../../../(profile)/user/[id]/edit/user-form.svelte';
	import type { PageData } from './$types';
	import OsteopathForm from './osteopath-form.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import ImageUpload from '../../../(profile)/user/[id]/edit/image-uploader.svelte';
	import { uploadFile } from '../../../(api)/image/upload';
	import Button from '$lib/components/ui/button/button.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { firebaseCloudMessaging } from '$lib/db/firebase';

	export let data: PageData;
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

	let image = data.user?.image;
	let notification_permission = false;

	onMount(async () => {
		notification_permission = Notification.permission === 'granted';
	});
	$: {
		if(notification_permission) {
			firebaseCloudMessaging.init()
		}
	}
</script>

<main class="w-full max-w-xl">
	<div class="mb-8 rounded-md border p-4">
		<h2 class="mb-1 text-xl text-muted-foreground">Personal Details</h2>
		<div class="my-4 flex items-center gap-x-4">
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
		<UserForm data={data.userForm} />
	</div>
	<div></div>
	<OsteopathForm data={data.osteopathForm} />
	<div class="mt-8 flex flex-col gap-y-4 rounded-md border p-4">
		<div>
			<h2 class="mb-1 text-xl text-muted-foreground">Notification</h2>
			{#if notification_permission}
				<button>Notification Enabled</button>
			{:else}
				<Button
					on:click={() => {
						Notification.requestPermission().then((permission) => {
							if (permission === 'granted') {
								new Notification('Notification Enabled');
								console.log('Notification Enabled');
							}
						});
					}}>
					Enable Notification
				</Button>
			{/if}
		</div>
		<div>
			<h2 class="mb-1 text-xl text-muted-foreground">Username</h2>
			<p class="text-sm text-foreground">Your username is {$page.params.username}</p>
		</div>
		<div>
			<h2 class="mb-1 text-xl text-muted-foreground">Calendar</h2>
			{#if data.calendar}
				<span>{data.calendar.gmail}</span>
				<!-- <a href="/calendar/disconnect" class="text-primary-foreground">Disconnect your calendar</a> -->
			{:else}
				<p class="mb-2 text-sm text-foreground">
					You can connect your calendar to your account to manage your availability and
					appointments.
				</p>
				<Button
					size="responsive"
					class="gap-x-2"
					variant="outline"
					href="/google/login?calendar=true"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width={31.27 / 1.5}
						height={32 / 1.5}
						viewBox="0 0 256 262"
						><path
							fill="#4285F4"
							d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
						/><path
							fill="#34A853"
							d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
						/><path
							fill="#FBBC05"
							d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
						/><path
							fill="#EB4335"
							d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
						/></svg
					>
					Connect Google Calendar
				</Button>
			{/if}
		</div>
	</div>
</main>
