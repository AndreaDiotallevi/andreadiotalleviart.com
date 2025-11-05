import type Stripe from "stripe"
import type { Currency } from "./stripe"

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
    const currentTime = Math.floor(Date.now() / 1000)
    return currentTime >= expiresAt
}

export const getClientSession = (): ClientSession => {
    const str = localStorage.getItem(clientSessionKey)

    if (!str) {
        return defaultClientSession
    }

    try {
        const clientSession = JSON.parse(str) as ClientSession

        if (isSessionExpired(clientSession.expiresAt)) {
            clearClientSession()
            return defaultClientSession
        }

        return clientSession
    } catch (error) {
        return defaultClientSession
    }
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

// --- Currency helpers (kept separate from client session) ---

const supportedCurrencies: Currency[] = ["gbp", "eur", "usd"]
const currencyKey = "currency"

export const getStoredCurrency = (): Currency => {
    const value = (localStorage.getItem(currencyKey) || "").toLowerCase()
    return (supportedCurrencies as string[]).includes(value)
        ? (value as Currency)
        : "gbp"
}

export const setStoredCurrency = (currency: Currency) => {
    localStorage.setItem(currencyKey, currency.toLowerCase())
}

export const clearStoredCurrency = () => {
    localStorage.removeItem(currencyKey)
}

export const updateCurrencyFromSession = (session: Stripe.Checkout.Session) => {
    const c = (session.currency as string | undefined)?.toLowerCase()
    if (c && (supportedCurrencies as string[]).includes(c)) {
        localStorage.setItem(currencyKey, c)
    }
}
