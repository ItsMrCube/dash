const cache = new Map<
	string,
	{
		data: unknown;
		expires: Date;
	}
>();

/**
 * @param cacheFor - The duration in seconds for which the fetched data should be cached.
 */
export async function json<T>(url: string, init?: FetchRequestInit, cacheFor = 10) {
	if (cache.has(url)) {
		const cached = cache.get(url);

		if (cached && cached.expires > new Date()) {
			return cached.data as T;
		}
	}

	const res = await fetch(url, init);

	const data: T = await res.json();

	if (cacheFor) {
		cache.set(url, {
			data: await data,
			expires: new Date(Date.now() + cacheFor * 1000)
		});
	}

	return data;
}

export function titleCase(str: string) {
	return str //
		.replace(/_/g, ' ')
		.replace(/\b\w+\b/g, (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase());
}
