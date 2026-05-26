import type { RuntimeContext } from "../runtime/context";
import { NDScriptError } from "../utils/errors";

export const Filter = {
	async execute(context: RuntimeContext, parts: unknown[]) {
		if (parts.length < 4) {
			throw new NDScriptError("FILTER requires MODEL > PROPERTY > VALUE");
		}

		const model = parts[1];
		const property = parts[2];
		const value = parts[3];

		context.log(`Filtering ${model}: ${property} = ${value}`);
	},
};
