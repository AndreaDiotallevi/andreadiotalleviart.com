// const sessionIdKey = "andreadiotalleviart:sessionId"

// export const setOrUpdateSessionId = ({ sessionId }: { sessionId: string }) => {
//     localStorage.setItem(sessionIdKey, sessionId)
// }

// export const getSessionId = () => {
//     return localStorage.getItem(sessionIdKey)
// }

// export const removeSessionId = () => {
//     localStorage.removeItem(sessionIdKey)
// }

// export const setOrUpdateLineItems = ({
//     lineItems,
// }: {
//     lineItems: { priceId: string; quantity: number }[]
// }) => {
//     localStorage.setItem(lineItemsKey, JSON.stringify(lineItems))
// }

const lineItemsKey = "andreadiotalleviart:lineItems"

export const getLineItems = () => {
    return JSON.parse(localStorage.getItem(lineItemsKey) || "[]") as {
        price: string
        quantity: number
    }[]
}

export const removeLineItems = () => {
    localStorage.removeItem(lineItemsKey)
}

export const addToCart = ({ priceId }: { priceId: string }) => {
    let lineItems = getLineItems()

    const existingItemIndex = lineItems.findIndex(
        item => item.price === priceId,
    )

    if (existingItemIndex == -1) {
        lineItems.push({ price: priceId, quantity: 1 })
    } else {
        lineItems[existingItemIndex].quantity += 1
    }

    localStorage.setItem(lineItemsKey, JSON.stringify(lineItems))
}
