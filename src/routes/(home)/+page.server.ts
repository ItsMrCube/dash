import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import { json } from '$lib';
import { getMeteo } from '$lib/meteo';

export const load = async () => {
	if (!env.latitude || !env.longitude || !env.pve) throw error(500, 'ENV Error');

	const data = {
		traefik: await json<Traefik>('https://traefik.home.mrcube.dev/api/http/routers'),
		meteo: await getMeteo(),
		pve: {
			status: (
				await json<PVE>('https://pve.home.mrcube.dev:8006/api2/json/nodes', {
					headers: {
						Authorization: env.pve
					}
				})
			).data[0],
			zfs: (
				await json<ZFS>(
					'https://pve.home.mrcube.dev:8006/api2/json/nodes/pve/storage/local-zfs/status',
					{
						headers: {
							Authorization: env.pve
						}
					}
				)
			).data
		}
	};

	return data;
};

type Traefik = {
	entryPoints: string[];
	service: string;
	rule: string;
	priority: number;
	status: string;
	using: string[];
	name: string;
	provider: string;
}[];

interface PVE {
	data: [
		{
			status: string;
			maxdisk: number;
			id: string;
			uptime: number;
			ssl_fingerprint: string;
			maxmem: number;
			cpu: number;
			level: string;
			disk: number;
			maxcpu: number;
			mem: number;
			node: string;
			type: string;
		}
	];
}

interface ZFS {
	data: {
		active: number;
		avail: number;
		content: string;
		enabled: number;
		shared: number;
		total: number;
		type: string;
		used: number;
	};
}
