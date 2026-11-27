// CreativeHub variant_id for each Stripe product SKU.
// A null entry blocks ordering for that SKU until the id is filled in.
export const theprintspaceVariantIdBySku: Record<string, string | null> = {
    print_flames_A3: null,
    "print_marble-lake_A3": null,
    "print_moonlight-1_A3": null,
    "print_moonlight-2_A3": null,
    "print_nebula-1_50x70": null,
    "print_nebula-2_50x70": null,
    "print_nebula-3_50x70": null,
}

export const getVariantIdForSku = (sku: string | null): string | null => {
    if (!sku) return null
    return theprintspaceVariantIdBySku[sku] ?? null
}
