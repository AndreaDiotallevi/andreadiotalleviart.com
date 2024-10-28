import { createCheckoutSession } from "@utils/serverless"
import {
    clearClientSession,
    getClientSession,
    updateClientSession,
} from "@utils/localStorage"
import { navigate } from "astro:transitions/client"
import type { Currency } from "@utils/stripe"

export const addToCart = async ({
    priceId,
    currency,
}: {
    priceId: string
    currency: Currency
}) => {
    const { sessionId, lineItems, promotionCode } = getClientSession()

    let newLineItems: typeof lineItems = []

    if (sessionId) {
        if (lineItems.find(item => item.price === priceId)) {
            newLineItems = lineItems.map(item => ({
                price: item.price,
                quantity:
                    item.price === priceId ? item.quantity + 1 : item.quantity,
            }))
        } else {
            newLineItems = [...lineItems, { price: priceId, quantity: 1 }]
        }
    } else {
        newLineItems = [{ price: priceId, quantity: 1 }]
    }

    const session = await createCheckoutSession({
        line_items: newLineItems,
        success_url: `${window.location.origin}/checkout/success`,
        currency,
        promotion_code: promotionCode,
    })

    if (!session) return { error: true }

    updateClientSession({ session, promotionCode })
    navigate(`/cart?session_id=${session.id}`)
}

export const removeFromCart = async ({
    priceId,
    currency,
}: {
    priceId: string
    currency: Currency
}) => {
    const { sessionId, lineItems, promotionCode } = getClientSession()

    let newLineItems: typeof lineItems = []

    if (sessionId) {
        if (lineItems.find(item => item.price === priceId)) {
            newLineItems = lineItems.map(item => ({
                price: item.price,
                quantity:
                    item.price === priceId ? item.quantity - 1 : item.quantity,
            }))
        } else {
            return
        }
    } else {
        return
    }

    if (newLineItems.filter(item => item.quantity).length === 0) {
        clearClientSession()
        navigate(`/cart`)
        return
    }

    const session = await createCheckoutSession({
        line_items: newLineItems.filter(item => item.quantity! > 0),
        success_url: `${window.location.origin}/checkout/success`,
        currency,
        promotion_code: promotionCode,
    })

    if (!session) return

    updateClientSession({ session, promotionCode })
    navigate(`/cart?session_id=${session.id}`)
}

export const addPromotionCode = async ({
    code,
    currency,
}: {
    code: string
    currency: Currency
}) => {
    const { lineItems } = getClientSession()

    if (lineItems.length === 0) return

    const session = await createCheckoutSession({
        line_items: lineItems,
        success_url: `${window.location.origin}/checkout/success`,
        currency,
        promotion_code: code,
    })

    if (!session) return

    updateClientSession({ session, promotionCode: code })
    navigate(`/cart?session_id=${session.id}`)
}

export const removePromotionCode = async ({
    currency,
}: {
    currency: Currency
}) => {
    const { lineItems } = getClientSession()

    if (lineItems.length === 0) return

    const session = await createCheckoutSession({
        line_items: lineItems,
        success_url: `${window.location.origin}/checkout/success`,
        currency,
    })

    if (!session) return

    updateClientSession({ session })
    navigate(`/cart?session_id=${session.id}`)
}
