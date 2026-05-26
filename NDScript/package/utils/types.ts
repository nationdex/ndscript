export function parseValue(
	value: string,
): string | number | boolean | null | undefined {
	// Boolean
	if (value === "true") return true;
	if (value === "false") return false;

	// Null
	if (value === "null") return null;

	// Undefined
	if (value === "undefined") return undefined;

	// Number
	if (value.trim() !== "" && !Number.isNaN(Number(value))) {
		return Number(value);
	}

	return value;
}
