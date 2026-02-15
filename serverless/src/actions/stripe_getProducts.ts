import { StripeProduct } from "../types/stripe"
import { initialiseClient } from "./stripe_initialiseClient"
import { getObjectText } from "./s3_getObject"
import { putObjectText } from "./s3_putObject"

const CACHE_KEY = "cache/stripe_products.json"

function sortProductsByDisplayOrder(products: StripeProduct[]): StripeProduct[] {
    return [...products].sort((a, b) => {
        const orderA = Number.parseInt(a.metadata?.displayOrder ?? "", 10)
        const orderB = Number.parseInt(b.metadata?.displayOrder ?? "", 10)
        const hasOrderA = Number.isFinite(orderA)
        const hasOrderB = Number.isFinite(orderB)

        if (hasOrderA && hasOrderB && orderA !== orderB) {
            return orderA - orderB
        }

        if (hasOrderA && !hasOrderB) return -1
        if (!hasOrderA && hasOrderB) return 1

        const displayNameA = a.metadata?.displayName ?? a.name ?? ""
        const displayNameB = b.metadata?.displayName ?? b.name ?? ""
        return displayNameA.localeCompare(displayNameB)
    })
}

export async function getProducts(): Promise<StripeProduct[]> {
    const bucket = process.env.BUCKET
    if (!bucket) {
        throw new Error("BUCKET env var is required")
    }

    // Try S3 cache first
    try {
        console.log("Attempting to read products from S3 cache...")
        const text = await getObjectText(CACHE_KEY)
        const products = JSON.parse(text) as StripeProduct[]
        console.log("Returning products from S3 cache")
        return sortProductsByDisplayOrder(products)
    } catch (error) {
        console.log("S3 cache miss or error; falling back to Stripe API")
    }

    const stripe = await initialiseClient()

    console.log("Getting Stripe products from Stripe API...")
    const response = await stripe.products.list({
        active: true,
        expand: ["data.default_price", "data.default_price.currency_options"],
    })

    const products = sortProductsByDisplayOrder(
        response.data.filter(
            product => product.metadata.category == "prints"
        ) as unknown as StripeProduct[]
    )

    // Write to S3 cache (best-effort)
    try {
        console.log("Writing products to S3 cache...")
        await putObjectText(CACHE_KEY, JSON.stringify(products), {
            contentType: "application/json",
            cacheControl: "public, max-age=300",
        })
    } catch (error) {
        console.error("Failed to write S3 cache", error)
    }

    return products
}
