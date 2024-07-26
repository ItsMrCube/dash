import { env } from '$env/dynamic/private';
import { json } from '$lib';
import type { openMeteo } from './types';

const cache = {
	data: null,
	updated: new Date(0)
};

export async function getMeteo() {
	if (cache.updated > new Date(Date.now() - 15 * 60 * 1000)) return cache.data;

	const data = await json<openMeteo>(
		`https://api.open-meteo.com/v1/forecast?latitude=${env.latitude}&longitude=${env.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code`
	);

	cache.data = data;
	cache.updated = new Date();

	return data;
}
