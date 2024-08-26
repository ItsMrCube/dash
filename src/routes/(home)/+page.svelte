<script lang="ts">
	import { env } from '$env/dynamic/public';

	export let data;

	const routers = data.traefik
		.filter(
			(v) => v.provider === 'docker' && v.entryPoints[0] === 'websecure' && v.service !== 'dash'
		)
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

	let form: HTMLFormElement;

	function search(query: string) {
		form.reset();
		window.location.href = `https://searx.home.mrcube.dev/search?q=${query}`;
	}
</script>

<div class="grid gap-8">
	<div class="card flex items-center justify-center">
		<!-- fixme or something -->
		<!-- <img
			src="https://openweathermap.org/img/wn/{data.meteo.current.weather[0].icon}.png"
			alt={data.meteo.current.weather[0].description}
			width="50"
			height="50"
		/> -->
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
		class="flex rounded-xl bg-slate-200 dark:bg-slate-900 overflow-clip h-12"
		bind:this={form}
		on:submit={(e) => search(e.target[0].value)}
	>
		<input
			class="w-full bg-transparent border-transparent focus:border-transparent focus:ring-0"
			placeholder="CubedSearch"
			type="text"
		/>
		<button class="bg-blue-500 dark:bg-blue-600 text-slate-50 px-4" aria-label="Search">
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
				<h3>{item.prettyName}</h3>
			</a>
		{/each}
	</div>

	<div class="box">
		<a
			href={env.PUBLIC_iliadbox ? env.PUBLIC_iliadbox : 'http://192.168.0.1'}
			target="_blank"
			class="card"
		>
			<h3>iliadbox</h3>
		</a>
		<a href="https://pve.home.mrcube.dev:8006" target="_blank" class="card">
			<h3>Proxmox</h3>
		</a>
		<a href="https://truenas.home.mrcube.dev" target="_blank" class="card">
			<h3>TrueNAS</h3>
		</a>
	</div>

	<div class="box">
		{#each metrics as metric}
			<div class="card grid gap-2.5">
				<div class="flex justify-between gap-16">
					<span>{metric.name}</span>
					<span class="whitespace-nowrap">{metric.content}</span>
				</div>
				<div class="bg-slate-300 rounded-full dark:bg-slate-800">
					<div
						class="bg-blue-500 dark:bg-blue-600 h-2.5 rounded-full"
						style="width: {metric.value}%"
					></div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
	.box {
		@apply flex flex-wrap gap-4;
	}

	.card {
		@apply bg-slate-200 dark:bg-slate-900 p-4 text-center rounded-xl basis-32 grow;
	}
</style>
