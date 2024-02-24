<script lang="ts">
	import { page } from '$app/stores';
</script>

<main class="w-full max-w-5xl p-4">
	<div class="w-full py-3 border rounded-xl">
		<h1 class="text-xl border-b-2 pb-3 px-4">Appointments</h1>
		<div class="flex flex-col gap-y-8">
			<slot/>
		</div>
	</div>
</main>
