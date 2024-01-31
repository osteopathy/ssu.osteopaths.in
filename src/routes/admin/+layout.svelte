<script context="module">
    export const modules = [
        {
            label: 'Courses',
            href: '/admin/courses'
        },
        {
            label: 'Users',
            href: '/admin/users'
        },
        {
            label: 'Osteopaths',
            href: '/admin/osteopaths'
        },
        {
            label: 'Feedback',
            href: '/admin/feedback'
        }
    ]
</script>
<script lang="ts">
	import { page } from "$app/stores";

</script>
<section class="w-full flex gap-x-4 p-10 max-w-5xl">
    <aside class="flex flex-col border p-6 rounded-md">
        <h2 class="">Modules</h2>
        <ul class="mt-4 flex flex-col gap-y-3">
            {#each modules as mod}
                <li class="">
                    <a aria-current={$page.url.pathname === mod.href ? 'page' : undefined} class="px-3 py-1 rounded-md bg-secondary aria-[current='page']:bg-accent aria-[current='page']:text-accent-foreground" href={mod.href}>
                        {mod.label}
                    </a>
                </li>
            {/each}
        </ul>
    </aside>
    <main class="rounded-md border p-6 w-full grow">
        <slot/>
    </main>
</section>
