<script lang="ts">
	import { codes } from '$lib/meteo/wmo';

	export let data;

	const routers = data.traefik
		.filter(
			(v) => v.provider === 'docker' && v.entryPoints[0] === 'websecure' && v.service !== 'dash'
		)
		.map((v) => ({
			...v,
			link: `https://${v.rule.match(/\(`(.+)`\)/)[1]}`
		}))
		.map((v) =>
			v.service === 'pihole'
				? {
						...v,
						link: v.link + '/admin'
					}
				: v
		);

	function getMeteo(key: keyof typeof data.meteo.current) {
		const value = data.meteo.current[key];
		const unit = data.meteo.current_units[key];

		return `${typeof value === 'number' ? value.toFixed(0) : value}${unit}`;
	}

	const meteoCode =
		codes[data.meteo.current.weather_code.toString()][data.meteo.current.is_day ? 'day' : 'night'];

	let form: HTMLFormElement;

	function search(query: string) {
		form.reset();
		window.location.href = `https://searx.home.mrcube.dev/search?q=${query}`;
	}
</script>

<div class="grid gap-8">
	<div class="text-center flex justify-center items-center card !py-0">
		<img class="h-16" src={meteoCode.image} alt={meteoCode.description} />
		<h3>
			{meteoCode.description} · {getMeteo('apparent_temperature')} · 💧 {getMeteo(
				'relative_humidity_2m'
			)}
		</h3>
	</div>

	<form
		class="flex rounded-xl bg-slate-200 dark:bg-slate-900 overflow-clip h-12"
		bind:this={form}
		on:submit={(e) => search(e.target[0].value)}
	>
		<input
			class="w-full bg-transparent border-transparent focus:border-transparent focus:ring-0"
			placeholder="CubedSearch"
			type="text"
		/>
		<button class="bg-blue-500 dark:bg-blue-600 text-slate-50 px-4">
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

	<div class="box">
		{#each routers as item}
			<a href={item.link} target="_blank" class="card">
				<h3>{item.rule.match(/`(\w+).+`/)[1]}</h3>
			</a>
		{/each}
	</div>

	<div class="box">
		<a href="http://192.168.0.1" target="_blank" class="card">
			<h3>iliadbox</h3>
		</a>
		<a href="https://pve.home.mrcube.dev:8006" target="_blank" class="card">
			<h3>Proxmox</h3>
		</a>
		<a href="https://truenas.home.mrcube.dev" target="_blank" class="card">
			<h3>TrueNAS</h3>
		</a>
	</div>
</div>

<style lang="postcss">
	.box {
		@apply grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4;
	}

	.card {
		@apply bg-slate-200 dark:bg-slate-900 p-4 text-center rounded-xl;
	}
</style>
