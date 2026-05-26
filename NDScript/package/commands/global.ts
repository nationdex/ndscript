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

    static async create(
        context: RuntimeContext,
        parts: string[]
    ) {

        const model = parts[1]

        const target = parts[2]

        context.log(
            `Creating ${model}: ${target}`
        )

    }

    static async delete(
        context: RuntimeContext,
        parts: string[]
    ) {

        const model = parts[1]

        const target = parts[2]

        context.log(
            `Deleting ${model}: ${target}`
        )

    }

    static async view(
        context: RuntimeContext,
        parts: string[]
    ) {

        const model = parts[1]

        const target = parts[2]

        context.log(
            `Viewing ${model}: ${target}`
        )

    }

}
