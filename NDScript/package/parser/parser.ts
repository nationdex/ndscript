import { RuntimeContext } from "../runtime/context"
import { Global } from "../commands/global"

export class NDScriptParser {

    context: RuntimeContext

    constructor() {

        this.context = new RuntimeContext()

    }

    async execute(code: string) {

        const lines = code.split("\n")

        for (const rawLine of lines) {

            const line = rawLine.trim()

            // Ignore empty lines
            if (!line) continue

            // Ignore comments
            if (line.startsWith("--")) continue

            // Split syntax
            const parts = line
                .split(">")
                .map(part => part.trim())

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

                    this.context.log(
                        `Unknown command: ${command}`
                    )

            }

        }

    }

}
