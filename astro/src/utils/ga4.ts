// @ts-nocheck
import Stripe from "stripe"

export const sendGA4PurchaseEvent = ({
    session,
}: {
    session: Stripe.Checkout.Session
}) => {
    try {
        const discount =
            session.total_details?.breakdown?.discounts[0]?.discount

        const gtagEventData: Gtag.EventParams = {
            transaction_id: session.id,
            currency: session.currency.toUpperCase(),
            value: (session.amount_total || 0) / 100,
            ...(discount?.coupon.name ? { coupon: discount.coupon.name } : {}),
            items: session.line_items?.data.map(item => ({
                item_id: item.price?.product.metadata.sku,
                item_name: item.price?.product.name,
                item_category: item.price?.product.metadata.category,
                price: item.amount_total / 100,
                discount: item.amount_discount / 100,
                quantity: item.quantity ?? 1,
            })),
        }

        if ("gtag" in window) {
            window.gtag("event", "purchase", gtagEventData)
        }
    } catch (error) {
        console.error(error)
    }
}

export const sendGA4BeginCheckoutEvent = ({
    session,
}: {
    session: Stripe.Checkout.Session
}) => {
    try {
        const discount =
            session.total_details?.breakdown?.discounts[0]?.discount

        const gtagEventData: Gtag.EventParams = {
            value: (session.amount_total || 0) / 100,
            currency: session.currency.toUpperCase(),
            ...(discount?.coupon.name ? { coupon: discount.coupon.name } : {}),
            items: session.line_items?.data.map(item => ({
                item_id: item.price?.product.metadata.sku,
                item_name: item.price?.product.name,
                item_category: item.price?.product.metadata.category,
                price: item.amount_total / 100,
                discount: item.amount_discount / 100,
                quantity: item.quantity ?? 1,
            })),
        }

        if ("gtag" in window) {
            window.gtag("event", "begin_checkout", gtagEventData)
        }
    } catch (error) {
        console.error(error)
    }
}
