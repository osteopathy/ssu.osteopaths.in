<script lang="ts">
	import { onMount } from "svelte";
	import BellIcon from "$lib/icons/BellIcon.svelte";
	import BellRingIcon from "$lib/icons/BellRingIcon.svelte";
	import CloseIcon from "$lib/icons/CloseIcon.svelte";
	import type { UserNotification } from "$lib/database/schema/notification";

	let isOpen = $state(false);
	let notifications = $state<UserNotification[]>([]);
	let unreadCount = $state(0);
	let loading = $state(false);

	async function fetchNotifications() {
		loading = true;
		try {
			const response = await fetch("/api/v1/notifications?limit=50");
			if (response.ok) {
				const data = await response.json();
				notifications = data.notifications;
				unreadCount = notifications.filter((n) => !n.readAt).length;
			}
		} catch (error) {
			console.error("Failed to fetch notifications:", error);
		} finally {
			loading = false;
		}
	}

	async function markAsRead(notificationId: string) {
		try {
			const response = await fetch(`/api/v1/notifications/${notificationId}`, {
				method: "PATCH"
			});
			if (response.ok) {
				// Update local state
				notifications = notifications.map((n) =>
					n.id === notificationId ? { ...n, readAt: new Date().toISOString() } : n
				);
				unreadCount = notifications.filter((n) => !n.readAt).length;
			}
		} catch (error) {
			console.error("Failed to mark notification as read:", error);
		}
	}

	async function markAllAsRead() {
		try {
			const response = await fetch("/api/v1/notifications/read-all", {
				method: "PATCH"
			});
			if (response.ok) {
				// Update local state
				notifications = notifications.map((n) => ({
					...n,
					readAt: n.readAt || new Date().toISOString()
				}));
				unreadCount = 0;
			}
		} catch (error) {
			console.error("Failed to mark all notifications as read:", error);
		}
	}

	function toggleNotificationCenter() {
		isOpen = !isOpen;
		if (isOpen && notifications.length === 0) {
			fetchNotifications();
		}
	}

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return "Just now";
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;
		return date.toLocaleDateString();
	}

	onMount(() => {
		fetchNotifications();
		// Poll for new notifications every 30 seconds
		const interval = setInterval(fetchNotifications, 30000);
		return () => clearInterval(interval);
	});
</script>

<div class="relative">
	<!-- Notification Bell Button -->
	<button
		onclick={toggleNotificationCenter}
		class="hover:bg-muted relative rounded-full p-2 transition-colors"
		aria-label="Notifications"
	>
		{#if unreadCount > 0}
			<BellRingIcon class="text-foreground size-6" />
			<span
				class="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
			>
				{unreadCount > 9 ? "9+" : unreadCount}
			</span>
		{:else}
			<BellIcon class="text-foreground size-6" />
		{/if}
	</button>

	<!-- Notification Panel -->
	{#if isOpen}
		<div
			class="fixed inset-0 z-50 md:absolute md:inset-auto md:top-12 md:right-0 md:w-96"
			role="dialog"
			aria-label="Notification panel"
			onclick={(e) => {
				if (e.target === e.currentTarget) isOpen = false;
			}}
			onkeydown={(e) => {
				if (e.key === 'Escape') isOpen = false;
			}}
		>
			<div
				class="bg-background border-border h-full w-full overflow-hidden rounded-none border shadow-lg md:h-auto md:max-h-[600px] md:rounded-lg"
			>
				<!-- Header -->
				<div class="border-border flex items-center justify-between border-b px-4 py-3">
					<h2 class="text-lg font-semibold">Notifications</h2>
					<div class="flex items-center gap-2">
						{#if unreadCount > 0}
							<button
								onclick={markAllAsRead}
								class="text-muted-foreground hover:text-foreground text-sm transition-colors"
							>
								Mark all read
							</button>
						{/if}
						<button
							onclick={() => (isOpen = false)}
							class="hover:bg-muted rounded-full p-1 transition-colors"
							aria-label="Close"
						>
							<CloseIcon class="size-5" />
						</button>
					</div>
				</div>

				<!-- Notification List -->
				<div class="max-h-[calc(100vh-60px)] overflow-y-auto md:max-h-[536px]">
					{#if loading}
						<div class="flex items-center justify-center py-8">
							<div class="text-muted-foreground">Loading...</div>
						</div>
					{:else if notifications.length === 0}
						<div class="flex flex-col items-center justify-center py-12">
							<BellIcon class="text-muted-foreground mb-2 size-12" />
							<p class="text-muted-foreground text-sm">No notifications yet</p>
						</div>
					{:else}
						{#each notifications as notification (notification.id)}
							<button
								onclick={() => !notification.readAt && markAsRead(notification.id)}
								class="hover:bg-muted border-border flex w-full items-start gap-3 border-b px-4 py-3 text-left transition-colors {!notification.readAt
									? 'bg-muted/50'
									: ''}"
							>
								<div class="flex-1">
									<div class="flex items-start justify-between gap-2">
										<h3 class="text-sm leading-tight font-medium">
											{notification.title}
										</h3>
										{#if !notification.readAt}
											<span class="mt-1 size-2 shrink-0 rounded-full bg-blue-500"></span>
										{/if}
									</div>
									<p class="text-muted-foreground mt-1 text-sm">
										{notification.body}
									</p>
									<span class="text-muted-foreground mt-1 text-xs">
										{formatDate(notification.createdAt)}
									</span>
								</div>
							</button>
						{/each}
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
