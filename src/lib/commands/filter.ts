import { normalizeModel, normalizeProperty } from "../data/nations";
import type { RuntimeContext } from "../runtime/context";
import { NDScriptError } from "../utils/errors";
import { asString } from "../utils/types";

function matchesValue(current: unknown, expected: unknown): boolean {
	if (typeof current === "number" || typeof expected === "number") {
		return Number(current) === Number(expected);
	}

	return asString(current).toLowerCase() === asString(expected).toLowerCase();
}

export const Filter = {
	async execute(context: RuntimeContext, parts: unknown[]) {
		if (parts.length < 4) {
			throw new NDScriptError("FILTER requires MODEL > PROPERTY > VALUE");
		}

		const model = normalizeModel(parts[1]);
		if (model !== "nation") {
			throw new NDScriptError(`FILTER does not support model "${asString(parts[1])}"`);
		}

		const data = await context.store.getNationsData();
		const property = normalizeProperty(parts[2]);
		const expected = parts[3];
		const matches: string[] = [];

		for (const [id, nation] of Object.entries(data.nations)) {
			if (matchesValue(nation[property], expected)) {
				matches.push(`${id}:${asString(nation.name ?? id)}`);
			}
		}

		context.log(
			matches.length
				? `Matched ${matches.length} nation(s): ${matches.join(", ")}`
				: `No nations matched ${property} = ${asString(expected)}`,
		);
	},
};
