import type Stripe from "stripe"

const clientSessionKey = "andreadiotalleviart"

interface ClientSession {
    sessionId: string
    totalQuantity: number
    lineItems: { price: string; quantity: number }[]
    promotionCode?: string
}

export const getClientSession = (): ClientSession => {
    const str = localStorage.getItem(clientSessionKey)

    if (!str) {
        return { totalQuantity: 0, lineItems: [], sessionId: "" }
    }

    return JSON.parse(str) as ClientSession
}

export const updateClientSession = ({
    session,
    promotionCode = "",
}: {
    session: Stripe.Checkout.Session
    promotionCode?: string
}) => {
    const clientSession: ClientSession = {
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
        promotionCode,
    }

    localStorage.setItem(clientSessionKey, JSON.stringify(clientSession))
}

export const clearClientSession = () => {
    localStorage.removeItem(clientSessionKey)
}
