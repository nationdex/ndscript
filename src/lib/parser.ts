import { Filter } from "./commands/filter";
import { Global } from "./commands/global";
import type { DataStore } from "./data/store";
import { NationDexStore } from "./data/store";
import { RuntimeContext } from "./runtime/context";
import { NDScriptError } from "./utils/errors";
import { parseValue } from "./utils/types";

export type ExecuteResult = {
	success: boolean;
	logs: string[];
	executionTime: number;
	error?: string;
};

export class NDScriptParser {
	private readonly store: DataStore;

	constructor(store: DataStore = new NationDexStore()) {
		this.store = store;
	}

	async execute(code: string): Promise<ExecuteResult> {
		const context = new RuntimeContext(this.store);
		context.savedScripts = new Map(Object.entries(await this.store.getScripts()));

		try {
			await this.runLines(context, code.split("\n"));
			await context.persistScripts();

			return {
				success: true,
				logs: context.logs,
				executionTime: Date.now() - context.startTime,
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);

			return {
				success: false,
				error: errorMessage,
				logs: context.logs,
				executionTime: Date.now() - context.startTime,
			};
		}
	}

	private async runLines(context: RuntimeContext, lines: string[]) {
		for (const rawLine of lines) {
			const line = rawLine.trim();
			if (!line || line.startsWith("--")) continue;

			if (line.startsWith("LET ")) {
				this.parseAssignment(context, line.slice(4));
				continue;
			}

			if (line.startsWith("SAVE ")) {
				this.parseSave(context, line.slice(5));
				continue;
			}

			if (line.startsWith("RUN ")) {
				const scriptName = line.slice(4).trim();
				const savedScript = context.getScript(scriptName);
				if (!savedScript) {
					throw new NDScriptError(`Unknown saved script: ${scriptName}`);
				}

				context.executionCount++;
				if (context.executionCount > context.maxExecutions) {
					throw new NDScriptError("Maximum execution limit reached");
				}

				await this.runLines(context, savedScript.split("\n"));
				continue;
			}

			if (line.startsWith("IF ")) {
				context.conditionPassed = this.resolveCondition(context, line.slice(3).trim());
				context.log(`Condition: ${context.conditionPassed}`);
				continue;
			}

			if (line === "ENDIF") {
				context.conditionPassed = true;
				continue;
			}

			if (!context.conditionPassed) {
				context.log(`Skipped: ${line}`);
				continue;
			}

			await this.runCommand(context, line);
		}
	}

	private parseAssignment(context: RuntimeContext, body: string) {
		const separator = body.indexOf("=");
		if (separator === -1) {
			throw new NDScriptError("Invalid LET syntax");
		}

		const key = body.slice(0, separator).trim();
		const value = body.slice(separator + 1).trim();
		context.setVariable(key, parseValue(value));
		context.log(`Variable set: ${key} = ${value}`);
	}

	private parseSave(context: RuntimeContext, body: string) {
		const separator = body.indexOf("=");
		if (separator === -1) {
			throw new NDScriptError("Invalid SAVE syntax");
		}

		const name = body.slice(0, separator).trim();
		const script = body.slice(separator + 1).trim();
		context.saveScript(name, script);
		context.log(`Saved script: ${name}`);
	}

	private resolveCondition(context: RuntimeContext, raw: string): boolean {
		if (raw.startsWith("$")) {
			return Boolean(context.getVariable(raw.slice(1)));
		}

		return Boolean(parseValue(raw));
	}

	private resolvePart(context: RuntimeContext, value: string): unknown {
		if (value.startsWith("$")) {
			return context.getVariable(value.slice(1)) ?? value;
		}

		return parseValue(value);
	}

	private async runCommand(context: RuntimeContext, line: string) {
		const parts = line.split(">").map((part) => this.resolvePart(context, part.trim()));
		const command = parts[0] ? String(parts[0]).toUpperCase() : "";

		switch (command) {
			case "UPDATE":
				await Global.update(context, parts);
				return;
			case "CREATE":
				await Global.create(context, parts);
				return;
			case "DELETE":
				await Global.delete(context, parts);
				return;
			case "VIEW":
				await Global.view(context, parts);
				return;
			case "FILTER":
				await Filter.execute(context, parts);
				return;
			default:
				throw new NDScriptError(`Unknown command: ${command || line}`);
		}
	}
}

export { NationDexStore } from "./data/store";
export { NDScriptError } from "./utils/errors";
