import { Filter } from "../commands/filter";
import { Global } from "../commands/global";
import { RuntimeContext } from "../runtime/context";
import { NDScriptError } from "../utils/errors";
import { parseValue } from "../utils/types";

export class NDScriptParser {
	context: RuntimeContext;
	constructor() {
		this.context = new RuntimeContext();
	}
	async execute(code: string) {
		try {
			this.context.executionCount++;
			if (this.context.executionCount > this.context.maxExecutions) {
				throw new NDScriptError("Maximum execution limit reached");
			}

			const lines = code.split("\n");

			for (const rawLine of lines) {
				const line = rawLine.trim();

				// Ignore empty lines
				if (!line) continue;

				// Ignore comments
				if (line.startsWith("--")) continue;

				// LET variables
				if (line.startsWith("LET ")) {
					const variableLine = line.replace("LET ", "");
					const firstEquals = variableLine.indexOf("=");

					if (firstEquals === -1) {
						throw new NDScriptError("Invalid LET syntax");
					}

					const key = variableLine.slice(0, firstEquals);
					const value = variableLine.slice(firstEquals + 1);
					this.context.setVariable(key.trim(), parseValue(value.trim()));
					this.context.log(`Variable set: ${key.trim()} = ${value.trim()}`);

					continue;
				}

				// SAVE scripts
				if (line.startsWith("SAVE ")) {
					const saveLine = line.replace("SAVE ", "");
					const firstEquals = saveLine.indexOf("=");

					if (firstEquals === -1) {
						throw new NDScriptError("Invalid SAVE syntax");
					}

					const name = saveLine.slice(0, firstEquals);
					const script = saveLine.slice(firstEquals + 1);
					this.context.saveScript(name.trim(), script.trim());
					this.context.log(`Saved script: ${name.trim()}`);

					continue;
				}

				// RUN saved scripts
				if (line.startsWith("RUN ")) {
					const scriptName = line.replace("RUN ", "").trim();
					const savedScript = this.context.getScript(scriptName);

					if (!savedScript) {
						throw new NDScriptError(`Unknown saved script: ${scriptName}`);
					}

					await this.execute(savedScript);

					continue;
				}

				// IF conditions
				if (line.startsWith("IF ")) {
					const conditionRaw = line.replace("IF ", "").trim();
					let conditionValue: unknown;

					if (conditionRaw.startsWith("$")) {
						conditionValue = this.context.getVariable(conditionRaw.slice(1));
					} else {
						conditionValue = parseValue(conditionRaw);
					}

					this.context.conditionPassed = Boolean(conditionValue);
					this.context.log(`Condition: ${this.context.conditionPassed}`);

					continue;
				}

				// ENDIF resets conditions
				if (line === "ENDIF") {
					this.context.conditionPassed = true;
					this.context.log("Condition reset");

					continue;
				}

				// Skip execution if IF failed
				if (!this.context.conditionPassed) {
					this.context.log(`Skipped: ${line}`);

					continue;
				}

				// Split syntax
				const parts = line.split(">").map((part) => {
					const value = part.trim();

					// Variable resolver
					if (value.startsWith("$")) {
						const variableName = value.slice(1);
						const variableValue = this.context.getVariable(variableName);
						return variableValue ?? value;
					}

					return parseValue(value);
				});

				// Main command
				const command = parts[0] ? String(parts[0]).toUpperCase() : undefined;

				switch (command) {
					case "UPDATE":
						await Global.update(this.context, parts);
						break;

					case "CREATE":
						await Global.create(this.context, parts);

						break;

					case "DELETE":
						await Global.delete(this.context, parts);
						break;

					case "VIEW":
						await Global.view(this.context, parts);
						break;

					case "FILTER":
						await Filter.execute(this.context, parts);
						break;

					default:
						throw new NDScriptError(`Unknown command: ${command}`);
				}
			}

			return {
				success: true,
				logs: this.context.logs,
				executionTime: Date.now() - this.context.startTime,
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			return {
				success: false,
				error: errorMessage,
				logs: this.context.logs,

				executionTime: Date.now() - this.context.startTime,
			};
		}
	}
}
