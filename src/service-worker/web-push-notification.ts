/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

// const sw = self as unknown as ServiceWorkerGlobalScope;

// export function onPush(event: PushEvent) {
//   const promise = isClientFocused().then((isFocused) => {
//     if (isFocused)
//       return Promise.resolve()

//     const options: PushPayload = event.data!.json()

//     return findNotification(options)
//       .catch((e) => {
//         console.error('unhandled error finding notification', e)
//         return Promise.resolve(undefined)
//       })
//       .then((notificationInfo) => {
//         return sw.registration.showNotification(options.title, createNotificationOptions(options, notificationInfo))
//       })
//   })

//   event.waitUntil(promise)
// }

// function isClientFocused() {
//     return sw.clients
//       .matchAll({ type: 'window', includeUncontrolled: true })
//       .then(windowClients => Promise.resolve(windowClients.some(windowClient => windowClient.focused)))
// }