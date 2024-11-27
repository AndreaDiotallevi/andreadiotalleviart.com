import Stripe from "stripe"
import type { StripePrice } from "./stripe"

const getCouponField = ({ session }: { session: Stripe.Checkout.Session }) => {
    const discount = session.total_details?.breakdown?.discounts[0]?.discount

    if (discount?.coupon.name) {
        return { coupon: discount.coupon.name }
    } else {
        return {}
    }
}

const getCommonFields = ({ session }: { session: Stripe.Checkout.Session }) => {
    return {
        currency: session.currency!.toUpperCase(),
        value: (session.amount_total || 0) / 100,
        items: session.line_items?.data.map(item => {
            const price = item.price as unknown as StripePrice

            return {
                item_id: price.product.metadata.sku,
                item_name: price?.product.name,
                item_category: price?.product.metadata.category,
                price: item.amount_total / 100 / (item.quantity ?? 1),
                discount: item.amount_discount / 100 / (item.quantity ?? 1),
                quantity: item.quantity ?? 1,
            }
        }),
    }
}

export const sendGA4PurchaseEvent = ({
    session,
}: {
    session: Stripe.Checkout.Session
}) => {
    try {
        const gtagEventData: Gtag.EventParams = {
            ...getCommonFields({ session }),
            ...getCouponField({ session }),
            transaction_id: session.id,
        }

        if ("gtag" in window) {
            // console.log(gtagEventData)
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
        const gtagEventData: Gtag.EventParams = {
            ...getCommonFields({ session }),
            ...getCouponField({ session }),
        }

        if ("gtag" in window) {
            // console.log(gtagEventData)
            window.gtag("event", "begin_checkout", gtagEventData)
        }
    } catch (error) {
        console.error(error)
    }
}
