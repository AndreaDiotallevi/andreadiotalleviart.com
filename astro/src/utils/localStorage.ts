import type Stripe from "stripe"

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

// const cartTotalQuantityKey = "andreadiotalleviart:cartTotalQuantity"

// export const setOrUpdateCartTotalQuantity = ({
//     quantity,
// }: {
//     quantity: number
// }) => {
//     localStorage.setItem(cartTotalQuantityKey, `${quantity}`)
// }

// export const getCartTotalQuantity = () => {
//     return parseInt(localStorage.getItem(cartTotalQuantityKey) || "0")
// }

// export const removeCartTotalQuantity = () => {
//     localStorage.removeItem(cartTotalQuantityKey)
// }

// export const setOrUpdateLineItems = ({
//     lineItems,
// }: {
//     lineItems: { priceId: string; quantity: number }[]
// }) => {
//     localStorage.setItem(lineItemsKey, JSON.stringify(lineItems))
// }

// const lineItemsKey = "andreadiotalleviart:lineItems"

// export const getLineItems = () => {
//     return JSON.parse(localStorage.getItem(lineItemsKey) || "[]") as {
//         price: string
//         quantity: number
//     }[]
// }

// export const removeLineItems = () => {
//     localStorage.removeItem(lineItemsKey)
// }

// export const addToCart = ({ priceId }: { priceId: string }) => {
//     let lineItems = getLineItems()

//     const existingItemIndex = lineItems.findIndex(
//         item => item.price === priceId,
//     )

//     if (existingItemIndex == -1) {
//         lineItems.push({ price: priceId, quantity: 1 })
//     } else {
//         lineItems[existingItemIndex].quantity += 1
//     }

//     localStorage.setItem(lineItemsKey, JSON.stringify(lineItems))
// }

const clientSessionKey = "andreadiotalleviart"

interface ClientSession {
    totalQuantity: number
    lineItems: { price: string; quantity: number }[]
    sessionId: string
}

export const getClientSession = (): ClientSession => {
    const str = localStorage.getItem(clientSessionKey)

    if (!str) {
        return { totalQuantity: 0, lineItems: [], sessionId: "" }
    }

    return JSON.parse(str) as ClientSession
}

export const updateClientSession = (session: Stripe.Checkout.Session) => {
    const clientSession = {
        sessionId: session.id,
        totalQuantity:
            session.line_items?.data.reduce(
                (total, item) => total + item.quantity!,
                0,
            ) || 0,
        lineItems:
            session.line_items?.data.map(item => ({
                price: item.price?.id!,
                quantity: item.quantity!,
            })) || [],
    }

    localStorage.setItem(clientSessionKey, JSON.stringify(clientSession))
}

export const clearClientSession = () => {
    localStorage.removeItem(clientSessionKey)
}
