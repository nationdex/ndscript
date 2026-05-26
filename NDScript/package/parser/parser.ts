import { RuntimeContext } from "../runtime/context"
import { Global } from "../commands/global"
import { NDScriptError } from "../utils/errors"
import { parseValue } from "../utils/types"

export class NDScriptParser {

    context: RuntimeContext

    constructor() {

        this.context = new RuntimeContext()

    }

    async execute(code: string) {

        try {

            const lines = code.split("\n")

            for (const rawLine of lines) {

                const line = rawLine.trim()

                // Ignore empty lines
                if (!line) continue

                // Ignore comments
                if (line.startsWith("--")) continue

                // Variable support
                if (line.startsWith("LET ")) {

                    const variableLine = line
                        .replace("LET ", "")

                    const [key, value] =
                        variableLine.split("=")

                    this.context.setVariable(
                        key.trim(),
                        parseValue(value.trim())
                    )

                    this.context.log(
                        `Variable set: ${key.trim()} = ${value.trim()}`
                    )

                    continue

                }

                // Save scripts
                if (line.startsWith("SAVE ")) {

                    const saveLine = line
                        .replace("SAVE ", "")

                    const [name, script] =
                        saveLine.split("=")

                    this.context.saveScript(
                        name.trim(),
                        script.trim()
                    )

                    this.context.log(
                        `Saved script: ${name.trim()}`
                    )

                    continue

                }

                // Run saved scripts
                if (line.startsWith("RUN ")) {

                    const scriptName = line
                        .replace("RUN ", "")
                        .trim()

                    const savedScript =
                        this.context.getScript(
                            scriptName
                        )

                    if (!savedScript) {

                        throw new NDScriptError(
                            `Unknown saved script: ${scriptName}`
                        )

                    }

                    await this.execute(savedScript)

                    continue

                }

                // Split command syntax
                const parts = line
                    .split(">")
                    .map(part => {

                        const value = part.trim()

                        // Variable resolver
                        if (value.startsWith("$")) {

                            const variableName =
                                value.slice(1)

                            const variableValue =
                                this.context.getVariable(
                                    variableName
                                )

                            return variableValue ?? value

                        }

                        return parseValue(value)

                    })

                // Main command
                const command = parts[0]?.toUpperCase()

                switch(command) {

                    case "UPDATE":

                        await Global.update(
                            this.context,
                            parts
                        )

                        break

                    case "CREATE":

                        await Global.create(
                            this.context,
                            parts
                        )

                        break

                    case "DELETE":

                        await Global.delete(
                            this.context,
                            parts
                        )

                        break

                    case "VIEW":

                        await Global.view(
                            this.context,
                            parts
                        )

                        break

                    default:

                        throw new NDScriptError(
                            `Unknown command: ${command}`
                        )

                }

            }

            return {

                success: true,

                logs: this.context.logs,

                executionTime:
                    Date.now() - this.context.startTime

            }

        } catch(error: any) {

            return {

                success: false,

                error: error.message,

                logs: this.context.logs,

                executionTime:
                    Date.now() - this.context.startTime

            }

        }

    }

}
