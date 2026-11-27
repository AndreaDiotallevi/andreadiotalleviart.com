import Stripe from "stripe"

import {
    CreativehubDelivery,
    CreativehubOrderItem,
} from "./theprintspace_client"
import { getVariantIdForSku } from "./theprintspace_variants"

export type FulfilmentLine = {
    sku: string | null
    displayName: string
    quantity: number
    amountTotal: number | null
    currency: string | null
    variantId: string | null
}

export const getFulfilmentLines = (
    session: Stripe.Checkout.Session,
): FulfilmentLine[] =>
    (session.line_items?.data ?? []).map(item => {
        const product =
            typeof item.price?.product === "object"
                ? (item.price.product as Stripe.Product)
                : null
        const sku = product?.metadata?.sku || null

        return {
            sku,
            displayName:
                product?.metadata?.displayName || item.description || "Item",
            quantity: item.quantity ?? 1,
            amountTotal: item.amount_total ?? null,
            currency: item.currency ?? null,
            variantId: getVariantIdForSku(sku),
        }
    })

export const getCreativehubItems = (
    lines: FulfilmentLine[],
): CreativehubOrderItem[] =>
    lines.map(line => ({
        variant_id: line.variantId as string,
        quantity: line.quantity,
    }))

export const getDeliveryFromSession = (
    session: Stripe.Checkout.Session,
): CreativehubDelivery | null => {
    const address = session.shipping_details?.address

    if (!address?.country) return null

    return {
        delivery_name:
            session.shipping_details?.name ||
            session.customer_details?.name ||
            "",
        delivery_line1: address.line1 || "",
        delivery_line2: address.line2 || undefined,
        delivery_city: address.city || "",
        delivery_county: address.state || undefined,
        delivery_postcode: address.postal_code || undefined,
        delivery_country_code: address.country,
        delivery_email: session.customer_details?.email || undefined,
        delivery_phone: session.customer_details?.phone || undefined,
    }
}

export const isPaymentRefunded = (
    session: Stripe.Checkout.Session,
): boolean => {
    const invoice = session.invoice
    if (!invoice || typeof invoice !== "object") return false
    const charge = (invoice as Stripe.Invoice).charge
    return (
        typeof charge === "object" &&
        charge !== null &&
        charge.refunded === true
    )
}

export const getFulfilmentBlockers = ({
    session,
    environment,
    lines,
}: {
    session: Stripe.Checkout.Session
    environment: string | undefined
    lines: FulfilmentLine[]
}): string[] => {
    const blockers: string[] = []

    if (session.payment_status !== "paid") {
        blockers.push("Payment has not been completed.")
    }

    if (isPaymentRefunded(session)) {
        blockers.push("Payment has been refunded.")
    }

    if (!session.livemode) {
        blockers.push(
            "This is a Stripe test-mode checkout, so ordering is disabled.",
        )
    }

    if (environment !== "production") {
        blockers.push(
            `This environment (${environment ?? "unknown"}) cannot place live CreativeHub orders.`,
        )
    }

    if (!getDeliveryFromSession(session)) {
        blockers.push("No shipping address on this checkout.")
    }

    if (lines.length === 0) {
        blockers.push("No line items on this checkout.")
    }

    const missingSkus = lines
        .filter(line => line.variantId === null)
        .map(line => line.sku ?? line.displayName)

    if (missingSkus.length > 0) {
        blockers.push(
            `No CreativeHub variant is set for: ${missingSkus.join(", ")}.`,
        )
    }

    return blockers
}
