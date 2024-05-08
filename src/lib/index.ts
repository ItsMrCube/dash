export function titleCase(str: string) {
	return str //
		.replace(/_/g, ' ')
		.replace(/\b\w+\b/g, (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase());
}
