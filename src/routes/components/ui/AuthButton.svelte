<script lang="ts">
	import LogIn from "@lucide/svelte/icons/log-in";
	import {
		FacebookAuthProvider,
		GithubAuthProvider,
		GoogleAuthProvider,
		OAuthProvider,
		TwitterAuthProvider,
		type User,
		createUserWithEmailAndPassword,
		getAuth,
		signInWithEmailAndPassword,
		signInWithPopup,
		signOut
	} from "firebase/auth";
	import { toast } from "svelte-sonner";

	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog/index";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";

	import { firebase_auth_schema } from "../ts/schemas";
	import { AuthMethod, type FirebaseAuth, type PropBase } from "../ts/types";

	interface Props extends PropBase {
		user: User | null;
		firebase_auth: FirebaseAuth;
	}

	let {
		user = $bindable(),
		firebase_auth = $bindable(),
		is_firebase_initialized
	}: Props = $props();

	const can_submit_firebase_auth = $derived(!firebase_auth_schema.safeParse(firebase_auth).success);

	const providers = {
		Google: () => auth(AuthMethod.Google),
		Apple: () => auth(AuthMethod.Apple),
		Facebook: () => auth(AuthMethod.Facebook),
		Twitter: () => auth(AuthMethod.Twitter),
		Github: () => auth(AuthMethod.Github)
	} as const;

	async function sign_out() {
		const auth = getAuth();
		await signOut(auth);
		toast.success("Succesfully signed out.");
	}

	async function auth(method: AuthMethod) {
		const auth = getAuth();

		try {
			if (method === AuthMethod.SignIn || method === AuthMethod.SignUp) {
				firebase_auth_schema.parse(firebase_auth);
			}

			async function wrap(fn: () => Promise<void>) {
				try {
					const v = await fn();
					toast.success(`Succesfully signed in.`);
					return v;
				} catch (e) {
					toast.error(
						"An error occured while trying to sign in, check the browser console for detailed information."
					);
					console.error(e);
				}
			}

			switch (method) {
				case AuthMethod.SignIn:
					wrap(async () => {
						user = (
							await signInWithEmailAndPassword(auth, firebase_auth.email, firebase_auth.password)
						).user;
					});
					break;
				case AuthMethod.SignUp:
					wrap(async () => {
						user = (
							await createUserWithEmailAndPassword(
								auth,
								firebase_auth.email,
								firebase_auth.password
							)
						).user;
					});
					break;
				case AuthMethod.Google:
					wrap(async () => {
						user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
					});
					break;
				case AuthMethod.Apple:
					wrap(async () => {
						user = (await signInWithPopup(auth, new OAuthProvider("apple.com").addScope("name")))
							.user;
					});
					break;
				case AuthMethod.Facebook:
					wrap(async () => {
						user = (await signInWithPopup(auth, new FacebookAuthProvider())).user;
					});
					break;
				case AuthMethod.Twitter:
					wrap(async () => {
						user = (await signInWithPopup(auth, new TwitterAuthProvider())).user;
					});
					break;
				case AuthMethod.Github:
					wrap(async () => {
						user = (await signInWithPopup(auth, new GithubAuthProvider())).user;
					});
					break;
			}
		} catch (e) {
			toast.error(
				"An error occured while trying to use auth functions, check the browser console for detailed information."
			);
			console.error(e);
		}
	}
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: "default" })}><LogIn /></Dialog.Trigger>
	<Dialog.Content>
		{#if is_firebase_initialized}
			<Dialog.Header>
				<Dialog.Title>Firebase Auth</Dialog.Title>
				<Dialog.Description
					>Sign in or up using Firebase Auth using various methods.</Dialog.Description
				>
			</Dialog.Header>
			<div class="flex flex-col gap-8">
				{#each Object.keys(firebase_auth) as f}
					{@const field = f as keyof FirebaseAuth}
					<div class="space-y-4">
						<Label class="capitalize">{field}</Label>
						<sup class="text-red-500 font-mono">*</sup>
						<Input bind:value={firebase_auth[field]} />
					</div>
				{/each}
				<div class="flex w-full flex-row items-center justify-between gap-2">
					<Button
						disabled={can_submit_firebase_auth}
						onclick={() => auth(AuthMethod.SignIn)}
						class="w-full">Sign In</Button
					>
					<Button
						disabled={can_submit_firebase_auth}
						onclick={() => auth(AuthMethod.SignUp)}
						class="w-full">Sign Up</Button
					>
				</div>

				<div class="flex w-full flex-row items-center justify-between gap-2">
					{#snippet sep()}
						<!-- not correct color but the bg-secondary is bugged at light mode -->
						<div class="bg-muted-foreground w-full h-px"></div>
					{/snippet}

					{@render sep()}
					<p>or</p>
					{@render sep()}
				</div>

				<div class="flex flex-wrap items-center justify-center gap-2">
					{#each Object.entries(providers) as provider}
						<Button onclick={provider[1]} class="flex-1">
							Sign in with {provider[0]}
						</Button>
					{/each}
					<Button onclick={sign_out} class="flex-1">Sign Out</Button>
				</div>
			</div>
		{:else}
			<div class="flex h-full items-center justify-center p-4">
				<p>You must initialize a Firebase app before using auth functions.</p>
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>
