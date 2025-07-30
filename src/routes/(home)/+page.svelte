<script lang="ts">
	import { env } from '$env/dynamic/public';

	let { data } = $props();

	const routers = data.traefik
		.map((v) => ({
			...v,
			link: `https://${v.rule.match(/\(`(.+)`\)/)[1]}`,
			prettyName: v.rule.match(/`(\w+).+`/)[1]
		}))
		.sort((a, b) => a.prettyName.localeCompare(b.prettyName));

	const metrics: {
		name: string;
		content: string;
		value: number;
	}[] = [
		{
			name: 'CPU',
			content: `${(data.pve.status.cpu * 100).toFixed(2)}%`,
			value: data.pve.status.cpu * 100
		},
		{
			name: 'Temperature',
			content: Intl.NumberFormat(undefined, { style: 'unit', unit: 'celsius' }).format(
				data.cpuTemperature.main
			),
			value: data.cpuTemperature.main
		},
		{
			name: 'RAM',
			content: `${(data.pve.status.mem / 1024 ** 3).toFixed(2)} of ${(
				data.pve.status.maxmem /
				1024 ** 3
			).toFixed(0)} GB`,
			value: (data.pve.status.mem / data.pve.status.maxmem) * 100
		},
		{
			name: 'ZFS',
			content: `${(data.pve.zfs.used / 1024 ** 3).toFixed(2)} of ${(data.pve.zfs.total / 1024 ** 3).toFixed(0)} GB`,
			value: (data.pve.zfs.used / data.pve.zfs.total) * 100
		}
	];

	let form: HTMLFormElement = $state();

	function search(query: string) {
		form.reset();
		window.location.href = `https://searx.gaia.mrcube.dev/search?q=${query}`;
	}
</script>

<div class="grid gap-8">
	<div class="card flex items-center justify-center">
		<div>
			<p>
				The current temperature is {data.meteo.current.temp.toFixed(0)}°C, it feels like {data.meteo.current.feels_like.toFixed(
					0
				)}°C with {data.meteo.current.weather[0].description}.
			</p>
			<p>
				Humidity is at {data.meteo.current.humidity}%, UV index is {data.meteo.current.uvi.toFixed(
					0
				)}, and cloudiness is {data.meteo.current.clouds}%. The wind is blowing at {data.meteo.current.wind_speed.toFixed(
					0
				)} m/s.
			</p>
		</div>
	</div>

	<form
		class="flex h-12 overflow-clip rounded-xl bg-slate-200 dark:bg-slate-900"
		bind:this={form}
		onsubmit={(e) => search(e.target[0].value)}
	>
		<input
			class="w-full border-transparent bg-transparent focus:border-transparent focus:ring-0"
			placeholder="CubedSearch"
			type="text"
		/>
		<button class="bg-blue-500 px-4 text-slate-50 dark:bg-blue-600" aria-label="Search">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-6 w-6"
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
				<h3>{item.prettyName}</h3>
			</a>
		{/each}
	</div>

	<div class="box">
		{#each Object.entries(env).filter(([key]) => key.startsWith('PUBLIC_')) as [key, value]}
			<a href={value} target="_blank" class="card">
				<h3>{key.replace('PUBLIC_', '')}</h3>
			</a>
		{/each}
	</div>

	<div class="box">
		{#each metrics as metric}
			<div class="card grid gap-2.5">
				<div class="flex justify-between gap-16">
					<span>{metric.name}</span>
					<span class="whitespace-nowrap">{metric.content}</span>
				</div>
				<div class="rounded-full bg-slate-300 dark:bg-slate-800">
					<div
						class="h-2.5 rounded-full bg-blue-500 dark:bg-blue-600"
						style="width: {metric.value}%"
					></div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
	@reference "$lib/styles/main.css";

	.box {
		@apply flex flex-wrap gap-4;
	}

	.card {
		@apply grow basis-32 rounded-xl bg-slate-200 p-4 text-center dark:bg-slate-900;
	}
</style>
