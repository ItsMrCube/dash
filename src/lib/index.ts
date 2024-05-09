export async function json<T>(url: string, fetchFn: typeof fetch): Promise<T> {
	const data = await fetchFn(url);

	return data.json();
}

export function titleCase(str: string) {
	return str //
		.replace(/_/g, ' ')
		.replace(/\b\w+\b/g, (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase());
}
