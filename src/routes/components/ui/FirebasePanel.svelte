<script lang="ts">
	import { deleteApp, initializeApp } from "firebase/app";
	import { toast } from "svelte-sonner";

	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import * as Tabs from "$lib/components/ui/tabs/index.js";

	import { firebase_config_schema } from "../ts/schemas";
	import { type FirebaseConfig, type PropBase, TabState } from "../ts/types";

	interface Props extends PropBase {
		firebase_config: FirebaseConfig;
		is_firebase_initialized: boolean;
	}

	let {
		firebase_config = $bindable(),
		firebase_instance = $bindable(),
		is_firebase_initialized
	}: Props = $props();

	const can_submit_firebase_config = $derived(
		!firebase_config_schema.safeParse(firebase_config).success
	);

	function initialize_firebase_instance() {
		try {
			firebase_config_schema.parse(firebase_config);
			firebase_instance = initializeApp({
				apiKey: firebase_config.apiKey,
				projectId: firebase_config.projectId,
				appId: firebase_config.appId,
				databaseURL: firebase_config.databaseURL,
				authDomain: `${firebase_config.projectId}.firebaseapp.com`
			});

			if (!firebase_instance) {
				throw new Error();
			}

			toast.success("Succesfully created a new Firebase instance.");
		} catch (e) {
			toast.error(
				"An error occured while initializing a new Firebase instance, check the browser console for detailed information."
			);
			console.error(e);
		} finally {
			if (firebase_instance && firebase_instance.options) {
				console.info(
					"%c[Firebase Config]:",
					"font-weight: bold;",
					$state.snapshot(firebase_instance.options)
				);
			}
		}
	}

	function delete_firebase_instance() {
		if (!firebase_instance) {
			return;
		}

		toast.success("Succesfully deleted the current Firebase instance.");
		deleteApp(firebase_instance);
		firebase_instance = null;
	}
</script>

<Tabs.Content value={TabState.ProjectSettings}>
	<Card.Root class="h-[450px]">
		<Card.Content class="h-full flex flex-col justify-between gap-4">
			<div class="flex flex-col gap-4">
				{#each Object.keys(firebase_config) as f}
					{@const field = f as keyof FirebaseConfig}
					<div class="space-y-2">
						{#if field === "databaseURL"}
							<Label class="font-mono"
								>{field}
								<span class="text-muted-foreground">(used for RTDB)</span></Label
							>
						{:else}
							<Label class="font-mono">{field}</Label>
							<sup class="text-red-500 font-mono">*</sup>
						{/if}
						<Input class="font-mono" bind:value={firebase_config[field]} />
					</div>
				{/each}
			</div>

			{#if is_firebase_initialized}
				<Button variant="destructive" onclick={delete_firebase_instance}
					>Delete Firebase Instance</Button
				>
			{:else}
				<Button disabled={can_submit_firebase_config} onclick={initialize_firebase_instance}
					>Initialize Firebase Instance</Button
				>
			{/if}
		</Card.Content>
	</Card.Root>
</Tabs.Content>
