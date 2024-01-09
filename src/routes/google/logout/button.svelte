<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<form method="post" action="/google/logout" use:enhance>
	<button>Log out</button>
</form>
