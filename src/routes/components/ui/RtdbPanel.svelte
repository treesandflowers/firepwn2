<script lang="ts">
	import { get, getDatabase, ref, remove, set, update } from "firebase/database";
	import { toast } from "svelte-sonner";

	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import * as Select from "$lib/components/ui/select/index.js";
	import * as Tabs from "$lib/components/ui/tabs/index.js";

	import { commonly_used_collection_names } from "../ts/collections";
	import { code_to_html } from "../ts/highlighter";
	import { lock } from "../ts/lock";
	import { available_operations, rtdb_fields_schema } from "../ts/schemas";
	import { type PropBase, type Response, type RtdbFields, TabState } from "../ts/types";

	interface Props extends PropBase {
		rtdb_fields: RtdbFields;
		response: Response;
	}

	let {
		response = $bindable(),
		rtdb_fields = $bindable(),
		firebase_instance,
		is_firebase_initialized
	}: Props = $props();

	const can_submit_rtdb_query = $derived(
		!rtdb_fields_schema.safeParse(rtdb_fields).success || !firebase_instance?.options.databaseURL
	);

	export async function rtdb_query() {
		if (!firebase_instance) {
			return;
		}

		try {
			rtdb_fields_schema.parse(rtdb_fields);

			const db = getDatabase(firebase_instance);

			switch (rtdb_fields.method) {
				case "get": {
					const v = await get(ref(db, rtdb_fields.path));
					toast.success(`Successfully retrieved all data from "${rtdb_fields.path}".`);
					return v;
				}
				case "update": {
					await update(ref(db, rtdb_fields.path), JSON.parse(rtdb_fields.data));
					toast.success(`Successfully updated data at "${rtdb_fields.path}".`);
					break;
				}
				case "set": {
					await set(ref(db, rtdb_fields.path), JSON.parse(rtdb_fields.data));
					toast.success(`Successfully set data at "${rtdb_fields.path}".`);
					break;
				}
				case "delete": {
					await remove(ref(db, rtdb_fields.path));
					toast.success(`Successfully deleted all data at "${rtdb_fields.path}".`);
					break;
				}
			}
		} catch (e) {
			toast.error(
				"An error occured while querying RTDB, check the browser console for detailed information."
			);
			console.error(e);
		} finally {
			if (response.response) {
				console.info(
					"%c[RTDB Response]:",
					"font-weight: bold;",
					$state.snapshot(response.response)
				);
			}
		}
	}

	async function automatic_rtdb_scan() {
		const fs = getDatabase();
		let responses = [];

		try {
			for (const names of commonly_used_collection_names) {
				const snap = await get(ref(fs, names));

				if (snap.exists()) {
					toast.info(`Result found at ${names}.`);
					responses.push(snap);
				}
			}

			toast.success(
				`Automated scan done. Found ${responses.length} result${responses.length === 1 ? "" : "s"}.`
			);

			return responses;
		} catch (e) {
			toast.error(
				"An error occured while performing an automated scan, check the browser console for detailed information."
			);
			console.error(e);
		}
	}

	const rtdb_lock = lock();
	async function execute_rtdb_query() {
		await rtdb_lock(async () => {
			response.loading = true;
			response.response = await rtdb_query();
			response.highlighted = await code_to_html(JSON.stringify(response.response, null, 2));
			response.loading = false;
		});
	}

	const scan_lock = lock();
	async function execute_rtdb_automatic_scan() {
		await scan_lock(async () => {
			response.loading = true;
			response.response = await automatic_rtdb_scan();
			response.highlighted = await code_to_html(JSON.stringify(response.response, null, 2));
			response.loading = false;
		});
	}
</script>

<Tabs.Content value={TabState.RTDB}>
	<Card.Root class="h-[450px] relative overflow-hidden">
		{#if !is_firebase_initialized}
			<div class="absolute inset-0 z-50 flex items-center bg-black/25 backdrop-blur">
				<p class="text-center">You must initialize a Firebase app before querying.</p>
			</div>
		{/if}

		<Card.Content class="h-full flex flex-col justify-between gap-4">
			<div class="flex flex-col gap-4">
				{#each Object.keys(rtdb_fields) as f}
					{@const field = f as keyof RtdbFields}
					{#if field === "method"}
						<Select.Root type="single" bind:value={rtdb_fields.method}>
							<Label class="font-mono">{field} <sup class="text-red-500 font-mono">*</sup></Label>
							<Select.Trigger>{rtdb_fields.method}</Select.Trigger>

							<Select.Content>
								{#each available_operations as method_option}
									<Select.Item value={method_option}>{method_option}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					{:else if field === "data"}
						{#if rtdb_fields.method === "update" || rtdb_fields.method === "set"}
							<div class="space-y-2">
								<Label class="font-mono"
									>{field} <sup class="text-red-500 font-mono">*</sup>
									<span class="text-muted-foreground">(as a JSON object)</span></Label
								>
								<Input class="font-mono" bind:value={rtdb_fields[field]} />
							</div>
						{/if}
					{:else}
						<div class="space-y-2">
							<Label class="font-mono">{field}</Label>
							<sup class="text-red-500 font-mono">*</sup>
							<Input class="font-mono" bind:value={rtdb_fields[field]} />
						</div>
					{/if}
				{/each}
			</div>
			<div class="w-full flex flex-col gap-2">
				{#if rtdb_fields.method === "get"}
					<Button onclick={execute_rtdb_automatic_scan}>Automatic Scan</Button>
				{/if}
				<Button disabled={can_submit_rtdb_query} onclick={execute_rtdb_query}
					>Execute RTDB Query</Button
				>
			</div>
		</Card.Content>
	</Card.Root>
</Tabs.Content>
