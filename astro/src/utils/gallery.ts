export const IMAGE_INDEX_QUERY_PARAM = "imageIndex"

export function getSelectedImageIndex(url: URL | undefined, totalImages: number): number {
    if (!totalImages || totalImages < 0) return 0
    if (!url) return 0

    const param = url.searchParams.get(IMAGE_INDEX_QUERY_PARAM)
    if (param === null) return 0

    const parsed = Number(param)
    if (!Number.isInteger(parsed)) return 0

    if (parsed < 0) return 0
    if (parsed >= totalImages) return Math.max(0, totalImages - 1)

    return parsed
}
