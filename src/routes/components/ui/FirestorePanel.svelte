<script lang="ts">
	import {
		collection,
		deleteDoc,
		doc,
		getDoc,
		getDocs,
		getFirestore,
		setDoc,
		updateDoc
	} from "firebase/firestore";
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
	import { available_operations, firestore_fields_schema } from "../ts/schemas";
	import { type FirestoreFields, type PropBase, type Response, TabState } from "../ts/types";

	interface Props extends PropBase {
		firestore_fields: FirestoreFields;
		response: Response;
	}

	let {
		firestore_fields = $bindable(),
		response = $bindable(),
		firebase_instance,
		is_firebase_initialized
	}: Props = $props();

	const can_submit_firestore_query = $derived(
		!firestore_fields_schema.safeParse(firestore_fields).success
	);

	async function firestore_query() {
		if (!firebase_instance) {
			return;
		}

		try {
			firestore_fields_schema.parse(firestore_fields);

			const fs = getFirestore();

			switch (firestore_fields.method) {
				case "get": {
					const v = firestore_fields.documentId
						? (
								await getDoc(doc(fs, firestore_fields.collection, firestore_fields.documentId))
							).data()
						: (await getDocs(collection(fs, firestore_fields.collection))).docs.map((doc) =>
								doc.data()
							);
					toast.success(`Successfully retrieved all data from
					"${firestore_fields.collection}${firestore_fields.documentId ? "/" + firestore_fields.documentId : ""}".`);
					return v;
				}
				case "update": {
					await updateDoc(
						doc(fs, firestore_fields.collection, firestore_fields.documentId),
						JSON.parse(firestore_fields.data)
					);
					toast.success(
						`Succesfully updated doc for "${firestore_fields.collection}/${firestore_fields.documentId}".`
					);
					break;
				}
				case "set": {
					await setDoc(
						doc(fs, firestore_fields.collection, firestore_fields.documentId),
						JSON.parse(firestore_fields.data)
					);
					toast.success(
						`Succesfully set doc for "${firestore_fields.collection}/${firestore_fields.documentId}".`
					);
					break;
				}
				case "delete": {
					await deleteDoc(doc(fs, firestore_fields.collection, firestore_fields.documentId));
					toast.success(
						`Succesfully deleted doc for "${firestore_fields.collection}/${firestore_fields.documentId}".`
					);
					break;
				}
			}
		} catch (e) {
			toast.error(
				"An error occured while querying Firestore, check the browser console for detailed information."
			);
			console.error(e);
		} finally {
			if (response.response) {
				console.info(
					"%c[Firestore Response]:",
					"font-weight: bold;",
					$state.snapshot(response.response)
				);
			}
		}
	}

	async function automatic_firestore_scan() {
		const fs = getFirestore();
		let responses = [];

		try {
			for (const names of commonly_used_collection_names) {
				try {
					const snap = await getDocs(collection(fs, names));
					if (!snap.empty) {
						toast.success(`Result found at ${names}.`);
						responses.push(snap.docs.map((doc) => doc.data()));
					}
				} catch {
					toast.info(`Empty result at ${names}.`);
				}
			}

			toast.success(
				`Automated scan done. Found ${responses.length} collection${responses.length === 1 ? "" : "s"}.`
			);

			return responses;
		} catch (e) {
			toast.error(
				"An error occured while performing an automated scan, check the browser console for detailed information."
			);
			console.error(e);
		}
	}

	const firestore_lock = lock();
	async function execute_firestore_query() {
		await firestore_lock(async () => {
			response.loading = true;
			response.response = await firestore_query();
			response.highlighted = await code_to_html(JSON.stringify(response.response, null, 2));
			response.loading = false;
		});
	}

	const scan_lock = lock();
	async function execute_firestore_automatic_scan() {
		await scan_lock(async () => {
			response.loading = true;
			response.response = await automatic_firestore_scan();
			response.highlighted = await code_to_html(JSON.stringify(response.response, null, 2));
			response.loading = false;
		});
	}
</script>

<Tabs.Content value={TabState.Firestore}>
	<Card.Root class="h-[450px] relative overflow-hidden">
		{#if !is_firebase_initialized}
			<div class="absolute inset-0 z-50 flex items-center bg-black/25 backdrop-blur">
				<p class="text-center">You must initialize a Firebase app before querying.</p>
			</div>
		{/if}

		<Card.Content class="h-full flex flex-col justify-between gap-4">
			<div class="flex flex-col gap-4">
				{#each Object.keys(firestore_fields) as f}
					{@const field = f as keyof FirestoreFields}
					{#if field === "method"}
						<Select.Root type="single" bind:value={firestore_fields.method}>
							<Label class="font-mono">{field} <sup class="text-red-500 font-mono">*</sup></Label>
							<Select.Trigger>{firestore_fields.method}</Select.Trigger>

							<Select.Content>
								{#each available_operations as method_option}
									<Select.Item value={method_option}>{method_option}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					{:else if field === "data"}
						{#if firestore_fields.method === "update" || firestore_fields.method === "set"}
							<div class="space-y-2">
								<Label class="font-mono"
									>{field} <sup class="text-red-500 font-mono">*</sup>
									<span class="text-muted-foreground">(as a JSON object)</span></Label
								>
								<Input class="font-mono" bind:value={firestore_fields[field]} />
							</div>
						{/if}
					{:else}
						<div class="space-y-2">
							<Label class="font-mono">{field}</Label>
							{#if field !== "documentId" || firestore_fields.method !== "get"}
								<sup class="text-red-500 font-mono">*</sup>
							{/if}
							<Input class="font-mono" bind:value={firestore_fields[field]} />
						</div>
					{/if}
				{/each}
			</div>
			<div class="w-full flex flex-col gap-2">
				{#if firestore_fields.method === "get"}
					<Button onclick={execute_firestore_automatic_scan}>Automatic Scan</Button>
				{/if}
				<Button disabled={can_submit_firestore_query} onclick={execute_firestore_query}
					>Execute Firestore Query</Button
				>
			</div>
		</Card.Content>
	</Card.Root>
</Tabs.Content>
