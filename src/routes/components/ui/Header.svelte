<script lang="ts">
	const { children } = $props();
</script>

<div class="flex flex-row items-center justify-between">
	<div class="flex items-center gap-1">
		<p class="text-2xl">🔥</p>
		<a
			href="https://github.com/treesandflowers/firepwn2"
			target="_blank"
			class="text-2xl font-semibold hover:underline"
		>
			firepwn<sup class="text-primary">2</sup>
		</a>
	</div>

	<div class="flex flex-row items-center gap-2">
		{@render children?.()}
	</div>
</div>
