<script>
	import Button from "$lib/components/ui/button/button.svelte";
	import { ArrowRight } from "radix-icons-svelte";
</script>

<main class="w-full max-w-5xl p-4">
	<div class="w-full">
		<h2 class="mb-4 text-5xl">Explore Our Courses</h2>
	</div>
    <ul class="mt-12 grid sm:grid-cols-2 gap-12">
        <div class="bg-card-alt p-6 border shadow-inner shadow-muted/75 rounded-xl">
            <div class="flex flex-col gap-y-1 mb-4">
                <h2 class="text-2xl sm:text-3xl">Introduction to Osteopathy</h2>
                <p class="text-xl text-muted-foreground">Osteopathy is based on the idea that all the body's systems are interrelated. Osteopaths focus on treating the whole person, finding the root cause of problem</p>
            </div>
            <div>
                <Button href="/articles/intro" variant="link" class="p-0">Read More <ArrowRight class="ml-1"/></Button>
            </div>
        </div>
    </ul>
</main>