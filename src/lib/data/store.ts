import { DataBase } from "@tryforge/forge.db/dist/util/database";
import type { NationsData } from "./nations";

export interface NDScriptState {
	scripts: Record<string, string>;
	version: string;
}

export interface DataStore {
	getNationsData(): Promise<NationsData>;
	setNationsData(data: NationsData): Promise<void>;
	getScripts(): Promise<Record<string, string>>;
	setScripts(scripts: Record<string, string>): Promise<void>;
}

function parseStoredValue<T>(value: string | undefined): T | undefined {
	if (value === undefined) return undefined;

	try {
		return JSON.parse(value) as T;
	} catch {
		return value as T;
	}
}

async function readGlobal<T>(name: string): Promise<T | undefined> {
	const record = await DataBase.get({ name, type: "custom" });
	return parseStoredValue<T>(record?.value);
}

async function writeGlobal(name: string, value: unknown): Promise<void> {
	const serialized =
		typeof value === "string" ? value : JSON.stringify(value);

	await DataBase.set({
		name,
		type: "custom",
		value: serialized,
	});
}

export class NationDexStore implements DataStore {
	async getNationsData(): Promise<NationsData> {
		const data = await readGlobal<NationsData>("nationsData");
		if (!data?.nations) {
			throw new Error("NationDex nationsData is unavailable");
		}
		return data;
	}

	async setNationsData(data: NationsData): Promise<void> {
		await writeGlobal("nationsData", data);
	}

	async getScripts(): Promise<Record<string, string>> {
		const state = await readGlobal<NDScriptState>("ndscript");
		return state?.scripts ?? {};
	}

	async setScripts(scripts: Record<string, string>): Promise<void> {
		const state = (await readGlobal<NDScriptState>("ndscript")) ?? {
			scripts: {},
			version: "0.1.0-alpha",
		};

		await writeGlobal("ndscript", {
			...state,
			scripts,
		});
	}
}
