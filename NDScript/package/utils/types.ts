export function parseValue(value: any): any {

    // Boolean
    if (value === "true") return true

    if (value === "false") return false

    // Number
    if (!isNaN(Number(value))) {

        return Number(value)

    }

    // Null
    if (value === "null") return null

    return value

}
