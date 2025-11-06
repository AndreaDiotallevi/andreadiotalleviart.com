import type Stripe from "stripe"
import type { SupportedLocale } from "./currency"
import { supportedLocales } from "./currency"
 
const clientSessionKey = "session"

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

const localeKey = "locale"

export const getStoredLocale = (): SupportedLocale => {
    const value = (localStorage.getItem(localeKey) || "").toLowerCase()
    return ((supportedLocales as unknown as string[]).includes(value)
        ? (value as SupportedLocale)
        : ("en-gb" as SupportedLocale))
}

export const setStoredLocale = (locale: SupportedLocale) => {
    localStorage.setItem(localeKey, locale)
}

export const clearStoredLocale = () => {
    localStorage.removeItem(localeKey)
}
