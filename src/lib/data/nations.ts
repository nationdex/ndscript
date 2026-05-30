import { asString } from "../utils/types";

export type NationRecord = Record<string, unknown> & {
	name?: string;
	rarity?: number;
	class?: string;
	catch_names?: string[];
	translations?: string[];
};

export type NationsData = {
	classes: string[];
	total: number;
	common: number;
	uncommon: number;
	rare: number;
	mythic: number;
	legendary: number;
	total_caught: number;
	nations: Record<string, NationRecord>;
};

const PROPERTY_ALIASES: Record<string, string> = {
	RARITY: "rarity",
	CLASS: "class",
	NAME: "name",
	ATTACK: "attack",
	HEALTH: "health",
	WEIGHT: "weight",
	EMOJI: "emoji_id",
	CARD: "card",
	WILD_CARD: "wild_card",
};

const MODEL_ALIASES: Record<string, string> = {
	COUNTRY: "nation",
	NATION: "nation",
	REGIME: "class",
	SPECIAL: "special",
	RARITY: "rarity",
};

export function normalizeModel(model: unknown): string {
	const key = asUpper(model);
	return MODEL_ALIASES[key] ?? key.toLowerCase();
}

export function normalizeProperty(property: unknown): string {
	const key = asUpper(property);
	return PROPERTY_ALIASES[key] ?? asString(property).toLowerCase();
}

export function findNationId(
	nations: Record<string, NationRecord>,
	target: unknown,
): string | null {
	const query = asString(target);
	if (nations[query]) return query;

	const lower = query.toLowerCase();
	for (const [id, nation] of Object.entries(nations)) {
		if (asString(nation.name).toLowerCase() === lower) return id;

		if (
			Array.isArray(nation.catch_names) &&
			nation.catch_names.some((name) => asString(name).toLowerCase() === lower)
		) {
			return id;
		}

		if (
			Array.isArray(nation.translations) &&
			nation.translations.some((name) => asString(name).toLowerCase() === lower)
		) {
			return id;
		}
	}

	return null;
}

export function slugifyNationId(name: unknown): string {
	return asString(name)
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "_")
		.replace(/^_+|_+$/g, "");
}

export function createNationRecord(name: unknown): NationRecord {
	const label = asString(name);
	return {
		name: label,
		rarity: 1,
		class: "common",
		catch_names: [label.toLowerCase()],
		translations: [],
		attack: 10,
		health: 10,
		weight: 1,
		global_caught: 0,
	};
}

function asUpper(value: unknown): string {
	return asString(value).toUpperCase();
}
