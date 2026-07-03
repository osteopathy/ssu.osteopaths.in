<script lang="ts">
	import { preventDefault } from 'svelte/legacy';

	import { enhance } from "$app/forms";
	import PwaEnableNotification from "$lib/components/pwa/pwa-enable-notification.svelte";
	import PwaInstallButton from "$lib/components/pwa/pwa-install-button.svelte";
	import Avatar from "$lib/components/ui/avatar/avatar.svelte";
	import AppShell from "../../AppShell.svelte";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
</script>

<AppShell>
	{#snippet header()}
		<span>
			<a href="/">home</a> - {data.userCount} Users
		</span>
		<PwaEnableNotification />
		<PwaInstallButton />
	{/snippet}
	<ul>
		{#each data.users as user (user.id)}
			<li class="mb-10 flex flex-wrap items-center gap-4">
				<Avatar class="size-12" src={user.picture} alt="Pic" fallback="FA" />
				<form method="post" use:enhance>
					<input type="hidden" name="user_id" value={user.id} />
					<button>Sign In as</button>
				</form>
				<form method="post" use:enhance class="flex items-center gap-2">
					<input type="hidden" name="action" value="edit" />
					<input type="hidden" name="user_id" value={user.id} />
					<input
						type="text"
						name="name"
						value={user.name}
						placeholder="Name"
						class="w-24 rounded border px-2 py-1"
					/>
					<select name="role" class="rounded border px-2 py-1">
						<option value="user" selected={user.role === "user"}>user</option>
						<option value="student" selected={user.role === "student"}>student</option>
						<option value="service_provider" selected={user.role === "service_provider"}
							>service_provider</option
						>
						<option value="guest" selected={user.role === "guest"}>guest</option>
					</select>
					<select name="status" class="rounded border px-2 py-1">
						<option value="idle" selected={user.status === "idle"}>idle</option>
						<option value="verified" selected={user.status === "verified"}>verified</option>
					</select>
					<button type="submit">Update</button>
				</form>
				<form
					method="post"
					use:enhance
					onsubmit={preventDefault(() => confirm("Delete user?") || event.preventDefault())}
				>
					<input type="hidden" name="action" value="delete" />
					<input type="hidden" name="user_id" value={user.id} />
					<button class="text-red-600">Delete</button>
				</form>
				<span>{user.name}</span>
				<span>{user.role}</span>
				<span>{user.email}</span>
				<span>{user.universityMail}</span>
				<span>{user.status}</span>
				<span>{user.phone}</span>
			</li>
		{/each}
	</ul>
</AppShell>
