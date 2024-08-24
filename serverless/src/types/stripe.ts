import Stripe from "stripe"

export type ProductMetadata = {
    category: string
    displayName: string
    displayOrder: string
    orientation: string
    prodigiSku: string
    size: string
    slug: string
    sku: string
    theprintspaceProductId?: string
    theprintspacePrintOptionId?: string
}

export type ProductWithMetadata = Omit<Stripe.Product, "metadata"> & {
    metadata: ProductMetadata
}
