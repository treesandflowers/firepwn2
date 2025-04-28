<script lang="ts">
	import Code from "@lucide/svelte/icons/code";
	import Copy from "@lucide/svelte/icons/copy";
	import LoaderCircle from "@lucide/svelte/icons/loader-circle";
	import { toast } from "svelte-sonner";

	import * as Card from "$lib/components/ui/card/index.js";
	import { ScrollArea } from "$lib/components/ui/scroll-area";

	import { copy_response } from "../ts/functions";
	import type { PropBase, Response } from "../ts/types";

	interface Props extends PropBase {
		response: Response;
	}
	let { response = $bindable() }: Props = $props();
</script>

<!-- remove magic numbers from styling later... -->

<Card.Root class="relative max-w-full flex-grow lg:w-[450px] h-full">
	<Card.Header>
		<Card.Title class="text-md flex flex-row items-center gap-2">
			<Code class="h-4" />
			Response
		</Card.Title>
	</Card.Header>
	<Card.Content class="flex flex-col justify-between gap-4 h-full">
		{#if response.loading}
			<div class="max-w-[300px] lg:max-w-full h-[90%]">
				<div class="absolute top-[50%] right-[50%] translate-x-[50%] translate-y-[50%]">
					<LoaderCircle class="animate-spin" />
				</div>
			</div>
		{:else if response.response && response.highlighted}
			<ScrollArea
				orientation="both"
				class="relative max-w-[300px] rounded lg:max-w-full h-[90%] border bg-background p-4 font-mono"
			>
				{@html response.highlighted}

				<button
					onclick={() => copy_response(response.response)}
					class="absolute right-4 top-4 hover:opacity-75"
				>
					<Copy class="size-4" />
				</button>
			</ScrollArea>
		{:else}
			<div class="max-w-[300px] lg:max-w-full h-[90%]">
				<p>Theres no data to display right now!</p>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
