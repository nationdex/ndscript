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

            if (!line) continue

            if (line.startsWith("--")) continue

            const parts = line
                .split(">")
                .map(part => part.trim())

            const command = parts[0]?.toUpperCase()

            switch(command) {

                case "UPDATE":

                    await Global.update(
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
