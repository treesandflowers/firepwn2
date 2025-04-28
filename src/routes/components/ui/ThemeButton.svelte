<script>
	import Moon from "@lucide/svelte/icons/moon";
	import Sun from "@lucide/svelte/icons/sun";
	import { mode, toggleMode } from "mode-watcher";
	import { fade } from "svelte/transition";

	import { Button } from "$lib/components/ui/button";
</script>

<Button onclick={toggleMode}>
	{#key mode.current}
		<div in:fade>
			{#if mode.current === "dark"}
				<Moon />
			{:else}
				<Sun />
			{/if}
		</div>
	{/key}
</Button>
