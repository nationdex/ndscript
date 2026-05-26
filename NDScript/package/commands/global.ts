import { RuntimeContext } from "../runtime/context"

export class Global {

    static async update(
        context: RuntimeContext,
        parts: string[]
    ) {

        const model = parts[1]

        const target = parts[2]

        const property = parts[3]

        const value = parts[4]

        context.log(
            `Updating ${model} ${target}: ${property} -> ${value}`
        )

    }

}
