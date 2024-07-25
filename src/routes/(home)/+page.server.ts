import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import { json } from '$lib';
import { getMeteo } from '$lib/meteo';

export const load = async ({ fetch }) => {
	if (!env.latitude || !env.longitude) throw error(500, 'ENV Error');

	const data = {
		traefik: await json<Traefik>('https://traefik.home.mrcube.dev/api/http/routers', fetch),
		meteo: await getMeteo(fetch)
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
