<script lang="ts">
	import { onMount } from "svelte";
	import { PUBLIC_VAPID_KEY as VAPID_PUBLIC_KEY } from "$lib/const";

	let supported = $state(false);
	let subscribed = $state(false);

	async function subscribe() {
		console.log("Subscribing");
		try {
			const registration = await navigator.serviceWorker.ready;
			console.log("Registration Ready");

			const subscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: VAPID_PUBLIC_KEY
			});

			console.log(subscription);

			// TODO: Send subscription to server
			await fetch("/api/v1/push/subscribe", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(subscription)
			});

			subscribed = true;
		} catch (err) {
			console.error("Failed to subscribe to push notifications:", err);
		}
	}

	onMount(async () => {
		supported = "serviceWorker" in navigator && "PushManager" in window;

		if (supported) {
			const registration = await navigator.serviceWorker.ready;
			const subscription = await registration.pushManager.getSubscription();
			subscribed = !!subscription;
		}
	});
</script>

{#if supported}
	<button
		onclick={subscribe}
		disabled={subscribed}
		class="btn-fuchsia mt-4 cursor-pointer text-white disabled:bg-zinc-400/20 disabled:text-zinc-400"
	>
		{subscribed ? "Notifications Enabled" : "Enable Notifications"}
	</button>
{/if}
