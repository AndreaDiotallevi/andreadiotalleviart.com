import Stripe from "stripe"

import { initialiseClient } from "./stripe_initialiseClient"

export type PromotionCodeSummary = {
    id: string
    code: string
    discount: string
    expires_at: number | null
    times_redeemed: number
    max_redemptions: number | null
}

const formatAmountOff = (amountOff: number, currency: string): string => {
    const normalisedCurrency = currency.toUpperCase()
    try {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: normalisedCurrency,
        }).format(amountOff / 100)
    } catch {
        return `${(amountOff / 100).toFixed(2)} ${normalisedCurrency}`
    }
}

const formatDiscount = (coupon: Stripe.Coupon): string => {
    if (typeof coupon.percent_off === "number") {
        return `${coupon.percent_off}% off`
    }

    if (typeof coupon.amount_off === "number" && coupon.currency) {
        return `${formatAmountOff(coupon.amount_off, coupon.currency)} off`
    }

    return "—"
}

const isPromotionCodeAvailable = (
    promotionCode: Stripe.PromotionCode,
    coupon: Stripe.Coupon,
    nowInSeconds: number
): boolean => {
    if (!promotionCode.active || !coupon.valid) return false

    if (typeof promotionCode.expires_at === "number" && promotionCode.expires_at <= nowInSeconds) {
        return false
    }

    if (
        typeof promotionCode.max_redemptions === "number" &&
        promotionCode.times_redeemed >= promotionCode.max_redemptions
    ) {
        return false
    }

    return true
}

export const listPromotionCodes = async (params?: {
    limit?: number
}): Promise<{
    promotionCodes: PromotionCodeSummary[]
}> => {
    try {
        const stripe = await initialiseClient()
        const limit = Math.min(Math.max(params?.limit ?? 100, 1), 100)
        const nowInSeconds = Math.floor(Date.now() / 1000)

        const promotionCodesResponse = await stripe.promotionCodes.list({
            active: true,
            limit,
            expand: ["data.coupon"],
        })

        const promotionCodes = promotionCodesResponse.data
            .map((promotionCode) => {
                if (typeof promotionCode.coupon === "string" || !promotionCode.code) {
                    return null
                }

                const coupon = promotionCode.coupon
                if (!isPromotionCodeAvailable(promotionCode, coupon, nowInSeconds)) {
                    return null
                }

                return {
                    id: promotionCode.id,
                    code: promotionCode.code,
                    discount: formatDiscount(coupon),
                    expires_at: promotionCode.expires_at ?? null,
                    times_redeemed: promotionCode.times_redeemed,
                    max_redemptions: promotionCode.max_redemptions ?? null,
                }
            })
            .filter((promotionCode): promotionCode is PromotionCodeSummary => Boolean(promotionCode))
            .sort((a, b) => a.code.localeCompare(b.code))

        return { promotionCodes }
    } catch (error) {
        console.error("Failed to list promotion codes", error)
        throw error
    }
}
