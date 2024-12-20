import { z } from "zod"

const CurrencySchema = z.enum(["gbp", "eur", "usd"])

const stripePriceSchema = z.object({
    id: z.string(),
    object: z.literal("price"),
    active: z.boolean(),
    currency: z.string(),
    unit_amount: z.number(),
    product: z.object({
        id: z.string(),
        active: z.boolean(),
        name: z.string(),
        description: z.string(),
        images: z.array(z.string()),
        metadata: z.object({
            category: z.string(),
            displayName: z.string(),
            displayOrder: z.string(),
            orientation: z.string(),
            size: z.string(),
            slug: z.string(),
            sku: z.string(),
            theprintspacePrintOptionId: z.string(),
            theprintspaceProductId: z.string(),
        }),
    }),
    currency_options: z
        .record(
            CurrencySchema,
            z.object({
                unit_amount: z.number(),
                unit_amount_decimal: z.string(),
            }),
        )
        .refine((obj): obj is Required<typeof obj> =>
            CurrencySchema.options.every(key => obj[key] != null),
        ),
})

export type Currency = z.infer<typeof CurrencySchema>
export type StripePrice = z.infer<typeof stripePriceSchema>
