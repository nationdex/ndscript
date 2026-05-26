export function parseValue(value: any): any {

    // Boolean
    if (value === "true") return true

    if (value === "false") return false

    // Null
    if (value === "null") return null

    // Undefined
    if (value === "undefined") return undefined

    // Number
    if (!isNaN(Number(value))) {

        return Number(value)

    }

    return value

}
