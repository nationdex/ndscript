export class RuntimeContext {

    logs: string[] = []

    startTime: number = Date.now()

    log(message: string) {

        this.logs.push(message)

        console.log(`[NDScript] ${message}`)

    }

}
