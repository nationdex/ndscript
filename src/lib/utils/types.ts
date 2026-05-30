export type ParsedValue = string | number | boolean | null | undefined;

export function parseValue(value: string): ParsedValue {
	if (value === "true") return true;
	if (value === "false") return false;
	if (value === "null") return null;
	if (value === "undefined") return undefined;

	const trimmed = value.trim();
	if (trimmed !== "" && !Number.isNaN(Number(trimmed))) {
		return Number(trimmed);
	}

	return value;
}

export function asString(value: unknown): string {
	if (value === null || value === undefined) return String(value);
	return String(value);
}
