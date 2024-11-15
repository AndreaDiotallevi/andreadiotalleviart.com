import type Stripe from "stripe"

const clientSessionKey = "andreadiotalleviart"

interface ClientSession {
    sessionId: string
    totalQuantity: number
    lineItems: { price: string; quantity: number }[]
    promotionCode: string
    expiresAt: number
}

const defaultClientSession: ClientSession = {
    sessionId: "",
    totalQuantity: 0,
    lineItems: [],
    promotionCode: "",
    expiresAt: 0,
}

const isSessionExpired = (expiresAt: number) => {
    const currentTime = Math.floor(Date.now() / 1000) // Current time in seconds
    return currentTime >= expiresAt
}

export const getClientSession = (): ClientSession => {
    const str = localStorage.getItem(clientSessionKey)

    if (!str) {
        return defaultClientSession
    }

    const clientSession = JSON.parse(str) as ClientSession

    if (isSessionExpired(clientSession.expiresAt)) {
        clearClientSession()
        return defaultClientSession
    }

    return clientSession
}

export const updateClientSession = ({
    session,
    promotionCode = "",
}: {
    session: Stripe.Checkout.Session
    promotionCode?: ClientSession["promotionCode"]
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
        expiresAt: session.expires_at,
    }

    localStorage.setItem(clientSessionKey, JSON.stringify(clientSession))
}

export const clearClientSession = () => {
    localStorage.removeItem(clientSessionKey)
}
