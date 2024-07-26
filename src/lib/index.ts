export async function json<T>(url: string, init?: FetchRequestInit): Promise<T> {
	const data = await fetch(url, init);

	return data.json();
}

export function titleCase(str: string) {
	return str //
		.replace(/_/g, ' ')
		.replace(/\b\w+\b/g, (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase());
}
