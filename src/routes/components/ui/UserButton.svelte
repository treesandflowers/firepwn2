<script lang="ts">
	import type { User } from "@firebase/auth";
	import Copy from "@lucide/svelte/icons/copy";
	import UserRound from "@lucide/svelte/icons/user-round";

	import { buttonVariants } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog/index";
	import { ScrollArea } from "$lib/components/ui/scroll-area";

	import { copy_response } from "../ts/functions";
	import { code_to_html } from "../ts/highlighter";
	import type { PropBase } from "../ts/types";

	interface Props extends PropBase {
		user: User | null;
	}

	let { user = $bindable() }: Props = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: "default" })}><UserRound /></Dialog.Trigger>
	<Dialog.Content class={user ? "w-min" : ""}>
		{#if user}
			<Dialog.Header>
				<Dialog.Title>User Information</Dialog.Title>
				<Dialog.Description>Every field returned by the user object.</Dialog.Description>
			</Dialog.Header>
			{#await code_to_html(JSON.stringify(user, null, 2)) then v}
				<div class="flex items-center justify-center">
					<ScrollArea
						orientation="both"
						class="relative max-w-[350px] h-[400px] rounded border bg-background p-4 font-mono"
					>
						{@html v}

						<button
							onclick={() => copy_response(user)}
							class="absolute right-4 top-4 hover:opacity-75"
						>
							<Copy class="size-4" />
						</button>
					</ScrollArea>
				</div>
			{/await}
		{:else}
			<div class="flex h-full items-center justify-center p-4">
				<p>You must sign in first to view user information.</p>
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>
