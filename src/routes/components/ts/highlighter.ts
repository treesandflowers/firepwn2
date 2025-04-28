import { codeToHtml } from "shiki";
import { toast } from "svelte-sonner";

export async function code_to_html(code: string) {
	try {
		if (code.length > 10_000) {
			toast.warning(
				`Skipping highlighting as response is ${code.length - 10_000} longer then the allowed threshold of 10 000.`
			);
			return;
		}
		return await codeToHtml(code, {
			lang: "json",
			theme: "tokyo-night",
			transformers: [
				{
					postprocess(html) {
						return html.replace(/background-color:\s*[^;"]+;?/gi, "");
					}
				}
			]
		});
	} catch {
		/**/
	}
}
