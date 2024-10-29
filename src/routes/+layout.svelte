<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<main class="p-8 max-w-6xl mx-auto">
	{@render children()}
</main>
