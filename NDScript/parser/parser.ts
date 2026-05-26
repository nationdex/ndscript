export class NDScriptParser {

    async execute(code: string) {

        // Split multiline scripts
        const lines = code.split("\n")

        for (const rawLine of lines) {

            const line = rawLine.trim()

            // Ignore empty lines
            if (!line) continue

            // Ignore comments
            if (line.startsWith("--")) continue

            // Split command syntax
            const parts = line
                .split(">")
                .map(part => part.trim())

            // Debug log
            console.log("[NDScript]", parts)

        }

    }

}
