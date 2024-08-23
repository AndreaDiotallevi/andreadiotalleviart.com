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
    theprintspaceFilename: string
    theprintspaceProductId?: number
    theprintspacePrintOptionId?: number
}

export type ProductWithMetadata = Omit<Stripe.Product, "metadata"> & {
    metadata: ProductMetadata
}
