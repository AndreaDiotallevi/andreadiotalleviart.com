/**
 * Images eligible for SEO / Google metadata (og/twitter/JSON-LD / Merchant).
 * Always skip the first gallery image (flat artwork); never use it for metadata.
 */
export function productMetadataImages(images: string[] | undefined | null): string[] {
    return (images ?? []).slice(1).filter(Boolean)
}

export function productMetadataImage(images: string[] | undefined | null): string | undefined {
    return productMetadataImages(images)[0]
}
