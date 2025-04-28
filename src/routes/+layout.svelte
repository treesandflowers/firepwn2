<script lang="ts">
	import { dev } from "$app/environment";
	import "@fontsource-variable/jetbrains-mono";
	import "@fontsource-variable/playfair-display";
	import "@fontsource-variable/space-grotesk";
	import { injectAnalytics } from "@vercel/analytics/sveltekit";
	import { ModeWatcher } from "mode-watcher";

	import { Toaster } from "$lib/components/ui/sonner/index.js";

	import "../app.css";

	let { children } = $props();

	injectAnalytics({ mode: dev ? "development" : "production" });
</script>

<Toaster richColors />
<ModeWatcher />

{@render children?.()}
