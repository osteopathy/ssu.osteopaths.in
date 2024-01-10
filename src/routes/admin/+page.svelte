<script lang="ts">
	import { ArrowRightCircleIcon } from "lucide-svelte"
</script>

<main class="max-w-6xl w-full mt-16">
	<h2 class="text-7xl">Admin Dashboard</h2>
	<div class="grid sm:grid-cols-2 gap-10 mt-12">
		<a
			href="/admin/users"
			class="p-6 text-4xl bg-layer-3 hover:bg-layer-5 rounded-lg flex items-center justify-between"
		>
			<span>Users</span>
			<span><ArrowRightCircleIcon /></span>
		</a>
	</div>
</main>
