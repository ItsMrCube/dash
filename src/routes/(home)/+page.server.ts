import { error } from "@sveltejs/kit";
import { cpuTemperature } from "systeminformation";
import { env } from "$env/dynamic/private";
import { json } from "$lib";

export const load = async () => {
	if (!env.latitude || !env.longitude || !env.pve_token)
		throw error(500, "ENV Error");

	const data = {
		traefik: (
			await json<Traefik>("https://traefik.gaia.mrcube.dev/api/http/routers")
		).filter(
			(v) =>
				(v.provider === "docker" || v.provider === "file") &&
				v.entryPoints[0] === "websecure" &&
				!env.ignore_list.split(",").includes(v.service),
		),
		meteo: await json<Meteo>(
			`https://api.openweathermap.org/data/3.0/onecall?lon=${env.longitude}&lat=${env.latitude}&exclude=minutely,hourly,daily,alerts&units=metric&appid=${env.openweather_appid}`,
			undefined,
			60,
		),
		pve: {
			status: (
				await json<PVE>("https://nexus.mrcube.dev:8006/api2/json/nodes", {
					headers: {
						Authorization: env.pve_token,
					},
				})
			).data[0],
			zfs: (
				await json<ZFS>(
					"https://nexus.mrcube.dev:8006/api2/json/nodes/nexus/storage/local-zfs/status",
					{
						headers: {
							Authorization: env.pve_token,
						},
					},
				)
			).data,
		},
		cpuTemperature: await cpuTemperature(),
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

interface Meteo {
	lat: number;
	lon: number;
	timezone: string;
	timezone_offset: number;
	current: {
		dt: number;
		sunrise: number;
		sunset: number;
		temp: number;
		feels_like: number;
		pressure: number;
		humidity: number;
		dew_point: number;
		uvi: number;
		clouds: number;
		visibility: number;
		wind_speed: number;
		wind_deg: number;
		weather: [
			{
				id: number;
				main: string;
				description: string;
				icon: string;
			},
		];
	};
}

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
		},
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
