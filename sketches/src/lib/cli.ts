export type Args = Record<string, string | boolean>

export const parseArgs = (argv: string[]): Args => {
    const args: Args = {}
    for (let i = 0; i < argv.length; i++) {
        const token = argv[i]
        if (!token.startsWith("--")) continue
        const key = token.slice(2)
        const next = argv[i + 1]
        if (next === undefined || next.startsWith("--")) {
            args[key] = true
        } else {
            args[key] = next
            i++
        }
    }
    return args
}

export const readString = (
    args: Args,
    key: string,
    fallback: string,
): string => {
    const value = args[key]
    return typeof value === "string" ? value : fallback
}

export const readNumber = (
    args: Args,
    key: string,
    fallback: number,
): number => {
    const value = args[key]
    if (typeof value !== "string") return fallback
    const parsed = Number(value)
    if (!Number.isFinite(parsed)) {
        throw new Error(`Option --${key} expects a number, received "${value}"`)
    }
    return parsed
}

export const readFlag = (
    args: Args,
    key: string,
    fallback = false,
): boolean => {
    const value = args[key]
    if (value === undefined) return fallback
    if (typeof value === "boolean") return value
    return value !== "false" && value !== "0"
}
