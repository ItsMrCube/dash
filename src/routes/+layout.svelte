<script lang="ts">
	import '$lib/styles/main.css';

	let { children } = $props();
</script>

<main class="p-8 max-w-6xl mx-auto">
	{@render children()}
</main>
