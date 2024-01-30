<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { uploadFile } from '../../(api)/image/upload';
	import ImageUpload from './image-uploader.svelte';
	import { toast } from 'svelte-sonner';

	export let data;
	let image = data.user?.image;
	async function syncDB(image_url: string) {
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
				console.log(res);
			} else {
				console.log('Maybe Google Profile Image');
			}
		}
	}
</script>

<main class="flex w-full max-w-5xl flex-col p-4">
	<h2 class="mb-8 text-4xl">Profile</h2>
	<!-- <pre>{JSON.stringify(data.user)}</pre> -->
	<div class="flex items-center gap-x-8">
		<Avatar.Root class="size-20">
			<Avatar.Image src={image} alt="@" />
			<Avatar.Fallback>CN</Avatar.Fallback>
		</Avatar.Root>
		<ImageUpload
			on:handleUploadImage={async (e) => {
				image = e.detail;
				toast.loading('Uploading image');
                if(!image) {
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
                        await syncDB(url);
                        toast.success('Successfully synced with Database');
                    } catch (error) {
                        toast.error('Something went wrong');
                        console.log(error)
                    }
				} else {
					toast.error('Something went wrong');
				}
			}}
			imageSrc={image}
		/>
	</div>
</main>
