export const formatArrayItems = (items: string[]): string => {
    if (items.length === 1) {
        return items[0]
    } else {
        return items.slice(0, -1).join(", ") + " & " + items[items.length - 1]
    }
}
