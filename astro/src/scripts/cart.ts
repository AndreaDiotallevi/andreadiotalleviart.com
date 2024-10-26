import type Stripe from "stripe"

import {
    createCheckoutSession,
    retrieveCheckoutSession,
} from "@utils/serverless"
import {
    getSessionId,
    removeCartTotalQuantity,
    removeSessionId,
    setOrUpdateCartTotalQuantity,
    setOrUpdateSessionId,
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
    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    const sessionId = getSessionId()

    if (sessionId) {
        const currentSession = await retrieveCheckoutSession({
            sessionId,
        })

        const currentLineItems = currentSession?.line_items?.data.map(item => ({
            price: item.price?.id || "",
            quantity: item.quantity || 1,
        }))!

        if (currentLineItems.find(item => item.price === priceId)) {
            lineItems = currentLineItems.map(item => ({
                price: item.price,
                quantity:
                    item.price === priceId ? item.quantity + 1 : item.quantity,
            }))
        } else {
            lineItems = [...currentLineItems, { price: priceId, quantity: 1 }]
        }
    } else {
        lineItems = [{ price: priceId, quantity: 1 }]
    }

    const session = await createCheckoutSession({
        line_items: lineItems,
        success_url: `${window.location.origin}/shop/checkout/success`,
        currency,
    })

    if (!session) return { error: true }

    setOrUpdateCartTotalQuantity({
        quantity:
            session.line_items?.data.reduce(
                (total, item) => total + item.quantity!,
                0,
            ) || 0,
    })
    setOrUpdateSessionId({ sessionId: session.id })
    navigate(`/cart?session_id=${session.id}`)
}

export const removeFromCart = async ({
    priceId,
    currency,
}: {
    priceId: string
    currency: Currency
}) => {
    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    const sessionId = getSessionId()

    if (sessionId) {
        const currentSession = await retrieveCheckoutSession({
            sessionId,
        })

        const currentLineItems = currentSession?.line_items?.data.map(item => ({
            price: item.price?.id || "",
            quantity: item.quantity || 1,
        }))!

        if (currentLineItems.find(item => item.price === priceId)) {
            lineItems = currentLineItems.map(item => ({
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

    if (lineItems.filter(item => item.quantity).length === 0) {
        removeSessionId()
        removeCartTotalQuantity()
        navigate(`/cart`)
        return
    }

    const session = await createCheckoutSession({
        line_items: lineItems.filter(item => item.quantity! > 0),
        success_url: `${window.location.origin}/shop/checkout/success`,
        currency,
    })

    if (!session) return

    setOrUpdateCartTotalQuantity({
        quantity:
            session.line_items?.data.reduce(
                (total, item) => total + item.quantity!,
                0,
            ) || 0,
    })
    setOrUpdateSessionId({ sessionId: session.id })
    navigate(`/cart?session_id=${session.id}`)
}
