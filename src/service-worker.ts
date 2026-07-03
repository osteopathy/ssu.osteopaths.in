/// <reference types="vite/client" />
/// <reference lib="webworker" />

import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { clientsClaim } from "workbox-core";
// import { NavigationRoute, registerRoute } from 'workbox-routing';
// createHandlerBoundToURL

declare let self: ServiceWorkerGlobalScope;

// clean old assets
cleanupOutdatedCaches();

// self.__WB_MANIFEST is the default injection point
precacheAndRoute(self.__WB_MANIFEST);

// let allowlist: RegExp[] | undefined;
// in dev mode, we disable precaching to avoid caching issues
// if (import.meta.env.DEV) allowlist = [/^\/$/];

// to allow work offline
// registerRoute(new NavigationRoute(createHandlerBoundToURL('/'), { allowlist }));

self.addEventListener("push", (event) => {
	if (!event.data) return;

	const data = event.data.json();

	event.waitUntil(
		self.registration.showNotification(data.title, {
			body: data.body,
			icon: "/pwa-192x192.png", // Add your notification icon
			badge: "/pwa-192x192.png",
			data: { url: self.location.origin } // URL to open when notification is clicked
		})
	);
});

self.addEventListener("notificationclick", onNotificationClick);

export function onNotificationClick(event: NotificationEvent) {
	const reactToNotificationClick = new Promise((resolve) => {
		event.notification.close();
		resolve(openUrl(event.notification.data.url));
	});

	event.waitUntil(reactToNotificationClick);
}

function findBestClient(clients: WindowClient[]) {
	const focusedClient = clients.find((client) => client.focused);
	const visibleClient = clients.find((client) => client.visibilityState === "visible");

	return focusedClient || visibleClient || clients[0];
}

async function openUrl(url: string) {
	const clients = await self.clients.matchAll({ type: "window" });
	// Chrome 42-48 does not support navigate
	if (clients.length !== 0 && "navigate" in clients[0]) {
		const client = findBestClient(clients as WindowClient[]);
		await client.navigate(url).then((client) => client?.focus());
	}

	await self.clients.openWindow(url);
}

self.skipWaiting();
clientsClaim();
