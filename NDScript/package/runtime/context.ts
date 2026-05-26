export class RuntimeContext {

    logs: string[] = []

    variables: Map<string, any> = new Map()

    startTime: number = Date.now()

    log(message: string) {

        this.logs.push(message)

        console.log(`[NDScript] ${message}`)

    }

    setVariable(
        key: string,
        value: any
    ) {

        this.variables.set(key, value)

    }

    getVariable(key: string) {

        return this.variables.get(key)

    }

}
