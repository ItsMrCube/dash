import type { openMeteo } from '$lib/meteo/types.js';
import os from 'os';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

export const load = async ({ fetch }) => {
	if (!env.latitude || !env.longitude) throw error(500, 'ENV Error');

	const data = {
		traefik: await json<Traefik>('https://traefik.home.mrcube.dev/api/http/routers'),
		meteo: await json<openMeteo>(
			`https://api.open-meteo.com/v1/forecast?latitude=${env.latitude}&longitude=${env.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code`
		),
		system: [
			{ name: 'CPU', value: (os.loadavg()[2] / os.cpus().length) * 100, unit: '%' },
			{ name: 'RAM', value: (1 - os.freemem() / os.totalmem()) * 100, unit: '%' },
			{
				name: 'Temp',
				value: (await Bun.$`cat /sys/class/thermal/thermal_zone0/temp`.json()) / 1000,
				unit: '°C'
			},
			{
				name: 'Disk',
				value: parseFloat((await Bun.$`df /`.text()).match(/(\d+)%/)[1]),
				unit: '%'
			}
		]
	};

	return data;

	async function json<T>(url: string): Promise<T> {
		const data = await fetch(url);

		return data.json();
	}
};

type Traefik = [
	{
		entryPoints: ['traefik'];
		service: 'api@internal';
		rule: 'PathPrefix(`/api`)';
		priority: 0;
		status: 'enabled';
		using: ['traefik'];
		name: 'api@internal';
		provider: 'internal';
	},
	{
		entryPoints: ['websecure'];
		service: 'cdn';
		rule: 'Host(`cdn.home.mrcube.dev`)';
		priority: 27;
		status: 'enabled';
		using: ['websecure'];
		name: 'cdn@docker';
		provider: 'docker';
	}
];
