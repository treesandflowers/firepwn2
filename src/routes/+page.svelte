<script lang="ts">
	import type { FirebaseApp } from "firebase/app";
	import type { User } from "firebase/auth";

	import * as Tabs from "$lib/components/ui/tabs/index.js";

	import {
		type FirebaseAuth,
		type FirebaseConfig,
		type FirestoreFields,
		type Response,
		type RtdbFields,
		TabState
	} from "./components/ts/types";
	import AuthButton from "./components/ui/AuthButton.svelte";
	import FirebasePanel from "./components/ui/FirebasePanel.svelte";
	import FirestorePanel from "./components/ui/FirestorePanel.svelte";
	import Header from "./components/ui/Header.svelte";
	import ResponseCard from "./components/ui/ResponseCard.svelte";
	import RtdbPanel from "./components/ui/RtdbPanel.svelte";
	import ThemeButton from "./components/ui/ThemeButton.svelte";
	import UserButton from "./components/ui/UserButton.svelte";

	let user: User | null = $state(null);

	let firebase_instance: FirebaseApp | null = $state(null);

	let response: Response = $state({
		response: null,
		highlighted: null,
		loading: false
	});

	let firebase_config: FirebaseConfig = $state({
		apiKey: "",
		projectId: "",
		appId: "",
		databaseURL: ""
	});

	let firebase_auth: FirebaseAuth = $state({
		email: "",
		password: ""
	});

	let firestore_fields: FirestoreFields = $state({
		collection: "users",
		documentId: "",
		method: "get",
		data: ""
	});

	let rtdb_fields: RtdbFields = $state({
		path: "/",
		method: "get",
		data: ""
	});

	const is_firebase_initialized = $derived(!!firebase_instance);
</script>

<div class="flex min-h-screen items-center justify-center px-4 py-8">
	<div class="flex flex-col gap-4">
		<Header>
			<ThemeButton />
			<UserButton bind:user />
			<AuthButton bind:user bind:firebase_auth {is_firebase_initialized} />
		</Header>

		<div class="flex flex-col gap-8 lg:flex-row h-auto lg:h-[500px]">
			<Tabs.Root value={TabState.ProjectSettings} class="h-full flex-grow">
				<Tabs.List class="w-full">
					{#each Object.values(TabState) as state}
						<Tabs.Trigger class="w-full" value={state}>{state}</Tabs.Trigger>
					{/each}
				</Tabs.List>

				<FirebasePanel bind:firebase_config bind:firebase_instance {is_firebase_initialized} />
				<FirestorePanel
					bind:response
					bind:firestore_fields
					{firebase_instance}
					{is_firebase_initialized}
				/>
				<RtdbPanel bind:response bind:rtdb_fields {firebase_instance} {is_firebase_initialized} />
			</Tabs.Root>

			<ResponseCard bind:response />
		</div>
	</div>
</div>
