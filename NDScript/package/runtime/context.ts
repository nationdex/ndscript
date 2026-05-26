export class RuntimeContext {

    logs: string[] = []

    variables: Map<string, any> = new Map()

    savedScripts: Map<string, string> = new Map()

    conditionPassed: boolean = true

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

    saveScript(
        name: string,
        code: string
    ) {

        this.savedScripts.set(name, code)

    }

    getScript(name: string) {

        return this.savedScripts.get(name)

    }

}
