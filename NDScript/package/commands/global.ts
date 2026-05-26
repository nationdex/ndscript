import type { RuntimeContext } from "../runtime/context";
import { NDScriptError } from "../utils/errors";

export const Global = {
	async update(context: RuntimeContext, parts: unknown[]) {
		if (parts.length < 5) {
			throw new NDScriptError(
				"UPDATE requires MODEL > TARGET > PROPERTY > VALUE",
			);
		}

		const model = parts[1];
		const target = parts[2];
		const property = parts[3];
		const value = parts[4];

		context.log(`Updating ${model} ${target}: ${property} -> ${value}`);
	},

	async create(context: RuntimeContext, parts: unknown[]) {
		if (parts.length < 3) {
			throw new NDScriptError("CREATE requires MODEL > TARGET");
		}

		const model = parts[1];
		const target = parts[2];

		context.log(`Creating ${model}: ${target}`);
	},

	async delete(context: RuntimeContext, parts: unknown[]) {
		if (parts.length < 3) {
			throw new NDScriptError("DELETE requires MODEL > TARGET");
		}

		const model = parts[1];
		const target = parts[2];

		context.log(`Deleting ${model}: ${target}`);
	},

	async view(context: RuntimeContext, parts: unknown[]) {
		if (parts.length < 3) {
			throw new NDScriptError("VIEW requires MODEL > TARGET");
		}

		const model = parts[1];
		const target = parts[2];

		context.log(`Viewing ${model}: ${target}`);
	},
};
