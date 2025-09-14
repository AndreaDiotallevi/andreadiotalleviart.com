import Stripe from "stripe"
import { z } from "zod"

export type ProductMetadata = {
    category: string
    displayName: string
    displaySubtitle: string
    displayOrder: string
    orientation: string
    size: string
    slug: string
    sku: string
    theprintspaceProductId?: string
    theprintspacePrintOptionId?: string
}

export type ProductWithMetadata = Omit<Stripe.Product, "metadata"> & {
    metadata: ProductMetadata
}

const CurrencySchema = z.enum(["gbp", "eur", "usd"])

const metadataSchema = z.object({
    category: z.string(),
    displayName: z.string(),
    displaySubtitle: z.string(),
    displayOrder: z.string(),
    orientation: z.string(),
    size: z.string(),
    slug: z.string(),
    sku: z.string(),
    theprintspacePrintOptionId: z.string(),
    theprintspaceProductId: z.string(),
})

const currencyOptionsSchema = z
    .record(
        CurrencySchema,
        z.object({
            unit_amount: z.number(),
            unit_amount_decimal: z.string(),
        }),
    )
    .refine((obj): obj is Required<typeof obj> =>
        CurrencySchema.options.every(key => obj[key] != null),
    )

const stripePriceSchema = z.object({
    id: z.string(),
    object: z.literal("price"),
    active: z.boolean(),
    currency: z.string(),
    unit_amount: z.number(),
    currency_options: currencyOptionsSchema,
    product: z.object({
        id: z.string(),
        active: z.boolean(),
        name: z.string(),
        description: z.string(),
        images: z.array(z.string()),
        metadata: metadataSchema,
    }),
})

const stripeProductSchema = z.object({
    id: z.string(),
    active: z.boolean(),
    name: z.string(),
    description: z.string(),
    images: z.array(z.string()),
    metadata: metadataSchema,
    default_price: stripePriceSchema,
})

export type Currency = z.infer<typeof CurrencySchema>
export type StripePrice = z.infer<typeof stripePriceSchema>
export type StripeProduct = z.infer<typeof stripeProductSchema>
