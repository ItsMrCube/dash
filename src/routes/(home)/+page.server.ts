import os from 'os';
import { WTTR } from '$env/static/private';

export const load = async ({ fetch }) => {
	const data = {
		traefik: await json<Traefik>('https://traefik.home.mrcube.dev/api/http/routers'),
		wttr: text(`https://wttr.in/${WTTR}?format=%c+%C+%f`),
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

	console.log(data);

	return data;

	async function text(url: string): Promise<string> {
		const data = await fetch(url);

		return data.text();
	}

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
