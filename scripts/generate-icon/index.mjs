import { writeFile } from "node:fs/promises";
import { Buffer } from "node:buffer";
import { prepareSvelteComponent } from "./svelte-template.mjs";

const RequiredIcons = [
	{
		outline: "fluent:mail-inbox-all-24-regular",
		solid: "fluent:mail-inbox-all-24-filled",
		name: "Inbox"
	},
	{
		outline: "fluent:mail-inbox-24-regular",
		solid: "fluent:mail-inbox-24-filled",
		name: "EmptyInbox"
	},
	{
		outline: "fluent:notepad-person-24-regular",
		solid: "fluent:notepad-person-24-filled",
		name: "Notepad"
	},
	{
		outline: "fluent:settings-24-regular",
		solid: "fluent:settings-24-filled",
		name: "Settings"
	},
	{
		outline: "fluent:person-24-regular",
		solid: "fluent:person-24-filled",
		name: "Person"
	},
	{
		outline: "fluent:people-community-24-regular",
		solid: "fluent:people-community-24-filled",
		name: "People"
	},
	{
		path: "logos:google-icon",
		name: "Google"
	},
	// general
	{
		outline: "fluent:delete-24-regular",
		solid: "fluent:delete-24-filled",
		name: "Delete"
	},
	{
		outline: "fluent:upload-24-regular",
		solid: "fluent:upload-24-filled",
		name: "Upload"
	},
	{
		outline: "fluent:dismiss-circle-24-regular",
		solid: "fluent:dismiss-circle-24-filled",
		name: "Close"
	},
	{
		outline: "fluent:chevron-down-24-regular",
		solid: "fluent:chevron-down-24-filled",
		name: "ChevronDown"
	},
	{
		outline: "fluent:info-28-regular",
		solid: "fluent:info-28-filled",
		name: "Info"
	},
	{
		outline: "fluent:arrow-right-24-regular",
		solid: "fluent:arrow-right-24-filled",
		name: "ArrowRight"
	},
	{
		outline: "fluent:arrow-left-24-regular",
		solid: "fluent:arrow-left-24-filled",
		name: "ArrowLeft"
	},
	{
		outline: "fluent:calendar-edit-32-regular",
		solid: "fluent:calendar-edit-32-filled",
		name: "CalendarEdit"
	},
	{
		outline: "fluent:alert-24-regular",
		solid: "fluent:alert-24-filled",
		name: "Bell"
	},
	{
		outline: "fluent:alert-on-24-regular",
		solid: "fluent:alert-on-24-filled",
		name: "BellRing"
	},
	{
		outline: "fluent:more-vertical-24-regular",
		solid: "fluent:more-vertical-24-filled",
		name: "Menu"
	},
	{
		outline: "fluent:add-24-regular",
		solid: "fluent:add-24-filled",
		name: "Plus"
	},
	{
		outline: "fluent:lock-closed-24-regular",
		solid: "fluent:lock-closed-24-filled",
		name: "LockClosed"
	},
	{
		outline: "fluent:lock-open-24-regular",
		solid: "fluent:lock-open-24-filled",
		name: "LockOpened"
	}
];

const getName = (name) => "../../src/lib/icons/" + name + "Icon" + ".svelte";

RequiredIcons.forEach(async (detail) => {
	const component = prepareSvelteComponent(detail);
	const pathname = new URL(getName(detail.name), import.meta.url);

	try {
		const data = new Uint8Array(Buffer.from(component));
		await writeFile(pathname, data);
	} catch (err) {
		// When a request is aborted - err is an AbortError
		console.error(err);
	}
});
