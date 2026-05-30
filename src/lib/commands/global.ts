import {
	createNationRecord,
	findNationId,
	normalizeModel,
	normalizeProperty,
	slugifyNationId,
	type NationRecord,
} from "../data/nations";
import type { RuntimeContext } from "../runtime/context";
import { NDScriptError } from "../utils/errors";
import { asString } from "../utils/types";

function requireParts(parts: unknown[], count: number, message: string) {
	if (parts.length < count) {
		throw new NDScriptError(message);
	}
}

async function loadNations(context: RuntimeContext) {
	const data = await context.store.getNationsData();
	return { data, nations: data.nations };
}

export const Global = {
	async update(context: RuntimeContext, parts: unknown[]) {
		requireParts(
			parts,
			5,
			"UPDATE requires MODEL > TARGET > PROPERTY > VALUE",
		);

		const model = normalizeModel(parts[1]);
		if (model !== "nation") {
			throw new NDScriptError(`UPDATE does not support model "${asString(parts[1])}"`);
		}

		const { data, nations } = await loadNations(context);
		const nationId = findNationId(nations, parts[2]);
		if (!nationId) {
			throw new NDScriptError(`Nation not found: ${asString(parts[2])}`);
		}

		const property = normalizeProperty(parts[3]);
		const nation = nations[nationId] as NationRecord;
		const previous = nation[property];
		nation[property] = parts[4] as NationRecord[string];

		await context.store.setNationsData(data);
		context.log(
			`Updated ${nation.name ?? nationId}: ${property} ${asString(previous)} -> ${asString(parts[4])}`,
		);
	},

	async create(context: RuntimeContext, parts: unknown[]) {
		requireParts(parts, 3, "CREATE requires MODEL > TARGET");

		const model = normalizeModel(parts[1]);
		if (model !== "nation") {
			throw new NDScriptError(`CREATE does not support model "${asString(parts[1])}"`);
		}

		const { data, nations } = await loadNations(context);
		const name = asString(parts[2]);
		const nationId = slugifyNationId(name);

		if (nations[nationId]) {
			throw new NDScriptError(`Nation already exists: ${name}`);
		}

		nations[nationId] = createNationRecord(name);
		data.total = Object.keys(nations).length;
		data.common = Object.values(nations).filter((n) => n.class === "common").length;

		await context.store.setNationsData(data);
		context.log(`Created nation ${name} (${nationId})`);
	},

	async delete(context: RuntimeContext, parts: unknown[]) {
		requireParts(parts, 3, "DELETE requires MODEL > TARGET");

		const model = normalizeModel(parts[1]);
		if (model !== "nation") {
			throw new NDScriptError(`DELETE does not support model "${asString(parts[1])}"`);
		}

		const { data, nations } = await loadNations(context);
		const nationId = findNationId(nations, parts[2]);
		if (!nationId) {
			throw new NDScriptError(`Nation not found: ${asString(parts[2])}`);
		}

		const name = nations[nationId]?.name ?? nationId;
		delete nations[nationId];
		data.total = Object.keys(nations).length;

		await context.store.setNationsData(data);
		context.log(`Deleted nation ${name} (${nationId})`);
	},

	async view(context: RuntimeContext, parts: unknown[]) {
		requireParts(parts, 3, "VIEW requires MODEL > TARGET");

		const model = normalizeModel(parts[1]);
		if (model !== "nation") {
			throw new NDScriptError(`VIEW does not support model "${asString(parts[1])}"`);
		}

		const { nations } = await loadNations(context);
		const nationId = findNationId(nations, parts[2]);
		if (!nationId) {
			throw new NDScriptError(`Nation not found: ${asString(parts[2])}`);
		}

		context.log(JSON.stringify({ id: nationId, ...nations[nationId] }, null, 2));
	},
};
