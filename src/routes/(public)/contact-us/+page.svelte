<script lang="ts">
	import { ArrowRightIcon, MailIcon } from 'lucide-svelte';
</script>

<div class="py-10 px-2 max-w-5xl w-full flex flex-col items-center">
	<h1 class="text-4xl text-layer-11 font-black mb-12">Get in touch</h1>
	<div class="flex flex-col">
		<div class="flex flex-col items-start p-4 bg-layer-0 rounded-lg">
			<h2 class="sm:text-lg text-layer-11 mb-2 inline-flex gap-x-2">
				<MailIcon /> <span>Email Support</span>
			</h2>
			<p class="pl-8 text-layer-12 text-lg sm:text-xl mb-1">
				Prefer to Email? send us an email and we will get back to you soon.
			</p>
			<span
				class="text-base sm:text-lg pl-8 text-layer-13 underline underline-offset-4 inline-flex items-center"
			>
				<span>send now</span>
				<ArrowRightIcon size={20} />
			</span>
		</div>
	</div>
</div>
