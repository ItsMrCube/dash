<script lang="ts">
	export let data;

	const routers = data.traefik.filter(
		(v) => v.provider === 'docker' && v.entryPoints[0] === 'websecure'
	);

	let form: HTMLFormElement;

	function search(query: string) {
		form.reset();
		window.location.href = `https://searx.home.mrcube.dev/search?q=${query}`;
	}
</script>

<div class="grid gap-8">
	<h3 class="text-center">
		{#await data.wttr}
			...
		{:then wttr}
			{wttr}
		{/await}
	</h3>

	<div class="grid grid-cols-4 gap-4">
		{#each routers as item}
			<a href={`https://${item.rule.match(/\(`(.+)`\)/)[1]}`} target="_blank" class="card">
				<h3>{item.service.split('-')[0]}</h3>
			</a>
		{/each}
	</div>

	<div class="grid grid-cols-2 gap-4">
		{#each Object.keys(data.system) as k}
			<div class="card grid gap-2">
				<p class="opacity-50">{k.toUpperCase()}</p>
				<h2>{data.system[k].toFixed(0)}%</h2>
				<div></div>
				<progress class="rounded-xl bg-slate-800" value={data.system[k]} max="100"></progress>
			</div>
		{/each}
	</div>

	<form
		class="flex rounded-xl bg-slate-900 overflow-clip"
		bind:this={form}
		on:submit={(e) => search(e.target[0].value)}
	>
		<input
			class="w-full bg-transparent border-transparent focus:border-transparent focus:ring-0"
			placeholder="CubedSearch"
			type="text"
		/>
		<button class="bg-blue-500 px-4">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
				/>
			</svg>
		</button>
	</form>
</div>

<style lang="postcss">
	.card {
		@apply bg-slate-900 p-4 text-center rounded-xl;
	}
</style>
