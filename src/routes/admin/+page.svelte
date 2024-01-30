<script lang="ts">
    import { modules } from "./+layout.svelte"
</script>

<span>Admin Dashboard</span>

<div class="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3 md:grid-cols-4">
    {#each modules as mod}
        <a href={mod.href} class="p-4 bg-secondary">{mod.label}</a>
    {/each}
</div>