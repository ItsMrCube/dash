<script lang="ts">
	import '$lib/styles/main.css';

	let { children } = $props();
</script>

<main class="mx-auto max-w-6xl p-8">
	{@render children()}
</main>
