<script lang="ts">
	import { goto } from "$app/navigation";
	import UsernameDialog from "$lib/components/dialogs/username-dialog.svelte";

    let open = true;
</script>

<UsernameDialog onSuccess={(username) => goto(`/${username}`)} bind:open buttonVisible={false} />