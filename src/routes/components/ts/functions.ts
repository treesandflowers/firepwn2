import { toast } from "svelte-sonner";

export async function copy_response(value: any) {
	await navigator.clipboard.writeText(JSON.stringify(value, null, 2));
	toast.info("Copied to clipboard.");
}
