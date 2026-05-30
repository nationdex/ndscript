import type { DataStore } from "../data/store";

export class RuntimeContext {
	logs: string[] = [];
	variables = new Map<string, unknown>();
	savedScripts = new Map<string, string>();
	conditionPassed = true;
	readonly startTime = Date.now();
	executionCount = 0;
	readonly maxExecutions = 100;

	constructor(readonly store: DataStore) {}

	log(message: string) {
		this.logs.push(message);
	}

	setVariable(key: string, value: unknown) {
		this.variables.set(key, value);
	}

	getVariable(key: string) {
		return this.variables.get(key);
	}

	saveScript(name: string, code: string) {
		this.savedScripts.set(name, code);
	}

	getScript(name: string) {
		return this.savedScripts.get(name);
	}

	async persistScripts() {
		if (this.savedScripts.size === 0) return;
		await this.store.setScripts(Object.fromEntries(this.savedScripts));
	}
}
