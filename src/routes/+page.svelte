<script lang="ts">
	export let data;
</script>

<section class="flex  flex-col place-items-center gap-y-6 p-10">
	<p class="text-xl">Your User ID is {data.user?.id}</p>
	<h1 class="text-3xl font-bold">Welcome {data.user?.name}</h1>
	<p class="text-xl">Your Gmail Address is {data.user?.gmail}</p>
</section>
