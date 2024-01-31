<script lang="ts">
	import Cropper from 'svelte-easy-crop';
	import getCroppedImg from './canvasUtils';
	import Slider from '$lib/components/ui/slider/slider.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import Button from '$lib/components/ui/button/button.svelte';
	import { createEventDispatcher } from 'svelte';
	import { Upload } from 'radix-icons-svelte';
	import { buttonVariants } from '$lib/components/ui/button';

	let crop = { x: 0, y: 0 };
	let zoom: number = 1;

	const dispatch = createEventDispatcher()
	
	export let imageSrc: string|null|undefined;

	let image: string | null,
		fileinput,
		pixelCrop: { x: number; y: number; width: number; height: number },
		croppedImage: string | null;

	function onFileSelected(e) {
		let imageFile = e.target.files[0];
		let reader = new FileReader();
		reader.onload = (e) => {
			image = e.target.result;
		};
		reader.readAsDataURL(imageFile);
	}

	function previewCrop(e: any) {
		pixelCrop = e.detail.pixels;
	}

	async function cropImage() {
		if (image) croppedImage = await getCroppedImg(image, pixelCrop);
		dispatch('handleUploadImage', croppedImage)
	}

	function reset() {
		croppedImage = null;
		image = null;
	}
	let open = false;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger asChild let:builder>
		<button use:builder.action {...builder} class={buttonVariants({variant:'secondary',class:'gap-x-2'})}>
            <Upload size={20} /> Upload Photo
        </button>
	</Dialog.Trigger>
	<Dialog.Content>
		<div class="mb-4">
			<div class="cropper mt-6 flex flex-col items-center justify-center p-8">
				{#if !image}
					<div class="flex h-20 max-h-20 w-20 items-center justify-start rounded-full bg-muted">
						{#if imageSrc}
							<!-- svelte-ignore a11y-img-redundant-alt -->
							<img class="h-20 w-20 rounded-full" src={imageSrc} alt="Upload Image Alt" />
						{:else}
							<p>No Target</p>
						{/if}
					</div>
				{:else}
					<div class="crop-container h-40 max-h-40 w-40 rounded-full">
						<div class="relative h-40 w-40 rounded-full">
							<Cropper {image} bind:crop bind:zoom aspect={1} on:cropcomplete={previewCrop} />
						</div>
						<Slider
							value={[zoom]}
							min={1}
							max={3}
							step={0.1}
							onValueChange={(value) => (zoom = value[0] < 1 ? 1 : value[0])}
						/>
					</div>
				{/if}
				<label
					class="bg-subtle hover:text-emphasis border-subtle text-default mt-8 cursor-pointer rounded-sm border px-3 py-1 text-xs font-medium leading-4 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-1"
				>
					<input
						on:change={(e) => onFileSelected(e)}
						bind:this={fileinput}
						type="file"
						name="profile-image"
						placeholder="Upload Image"
						class="text-default pointer-events-none absolute mt-4 opacity-0"
						accept="image/*"
					/>
					Choose A File
				</label>
			</div>
		</div>
		<Dialog.Footer class="relative">
			<Button on:click={() => {
				cropImage();
				open = false;
			}}>Save</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- <div>
	{#if !image}
		<input
			type="file"
			
			on:change={(e) => onFileSelected(e)}
			bind:this={fileinput}
		/>
	{:else}
		{#if croppedImage}
			<h2>Cropped Output</h2>
			<img src={croppedImage} alt="Cropped profile" /><br />
		{:else}
			<br /><button type="button" on:click={cropImage}>Crop!</button>
		{/if}
		<button type="button" on:click={reset}>Start over?</button>
	{/if}
</div> -->
