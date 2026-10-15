import { mkdirSync, writeFileSync } from "fs"
import { dirname } from "path"
import sharp from "sharp"

export type Point = { x: number; y: number }

export type Page = {
    widthMm: number
    heightMm: number
    marginMm: number
    scale: number
}

export type PaperOptions = {
    pageWidthMm: number
    marginMm: number
    strokeWidthMm: number
    smooth: number
    previewWidth: number
}

// The page always matches the aspect ratio of the working image, so nothing is
// cropped and an A3 ratio source lands on a 297 x 420 sheet.
export const createPage = (
    imageWidth: number,
    imageHeight: number,
    pageWidthMm: number,
    marginMm: number,
): Page => {
    const drawableMm = pageWidthMm - marginMm * 2
    const scale = drawableMm / imageWidth
    return {
        widthMm: pageWidthMm,
        heightMm: imageHeight * scale + marginMm * 2,
        marginMm,
        scale,
    }
}

export const toPage = (page: Page, x: number, y: number): Point => ({
    x: page.marginMm + x * page.scale,
    y: page.marginMm + y * page.scale,
})

export const pathLengthMm = (points: Point[], closed: boolean): number => {
    let total = 0
    const segments = closed ? points.length : points.length - 1
    for (let i = 0; i < segments; i++) {
        const a = points[i]
        const b = points[(i + 1) % points.length]
        total += Math.hypot(b.x - a.x, b.y - a.y)
    }
    return total
}

// Douglas-Peucker. Keeps the drawing identical to the eye while removing the
// redundant vertices that small integration steps produce.
export const simplify = (points: Point[], tolerance: number): Point[] => {
    if (points.length < 3 || tolerance <= 0) return points

    const keep = new Uint8Array(points.length)
    keep[0] = 1
    keep[points.length - 1] = 1

    const stack: Array<[number, number]> = [[0, points.length - 1]]
    const toleranceSquared = tolerance * tolerance

    while (stack.length > 0) {
        const [first, last] = stack.pop()!
        if (last <= first + 1) continue

        const ax = points[first].x
        const ay = points[first].y
        const bx = points[last].x
        const by = points[last].y
        const dx = bx - ax
        const dy = by - ay
        const lengthSquared = dx * dx + dy * dy

        let worst = -1
        let worstIndex = first

        for (let i = first + 1; i < last; i++) {
            const px = points[i].x - ax
            const py = points[i].y - ay
            let distanceSquared: number
            if (lengthSquared === 0) {
                distanceSquared = px * px + py * py
            } else {
                const t = Math.max(
                    0,
                    Math.min(1, (px * dx + py * dy) / lengthSquared),
                )
                const ox = px - t * dx
                const oy = py - t * dy
                distanceSquared = ox * ox + oy * oy
            }
            if (distanceSquared > worst) {
                worst = distanceSquared
                worstIndex = i
            }
        }

        if (worst > toleranceSquared) {
            keep[worstIndex] = 1
            stack.push([first, worstIndex])
            stack.push([worstIndex, last])
        }
    }

    const simplified: Point[] = []
    for (let i = 0; i < points.length; i++) {
        if (keep[i]) simplified.push(points[i])
    }
    return simplified
}

const round = (value: number): string => {
    const rounded = Math.round(value * 100) / 100
    return Object.is(rounded, -0) ? "0" : String(rounded)
}

// One "d" attribute for the whole drawing: a single move followed by nothing but
// line or curve commands, so the pen never lifts.
export const buildPathData = (
    points: Point[],
    closed: boolean,
    smooth: number,
): string => {
    if (points.length < 2) return ""

    const parts: string[] = [`M ${round(points[0].x)} ${round(points[0].y)}`]

    if (smooth <= 0) {
        for (let i = 1; i < points.length; i++) {
            parts.push(`L ${round(points[i].x)} ${round(points[i].y)}`)
        }
        if (closed) parts.push("Z")
        return parts.join(" ")
    }

    const total = points.length
    const at = (index: number): Point =>
        closed
            ? points[((index % total) + total) % total]
            : points[Math.min(total - 1, Math.max(0, index))]

    const segments = closed ? total : total - 1
    for (let i = 0; i < segments; i++) {
        const p0 = at(i - 1)
        const p1 = at(i)
        const p2 = at(i + 1)
        const p3 = at(i + 2)

        const c1x = p1.x + ((p2.x - p0.x) * smooth) / 6
        const c1y = p1.y + ((p2.y - p0.y) * smooth) / 6
        const c2x = p2.x - ((p3.x - p1.x) * smooth) / 6
        const c2y = p2.y - ((p3.y - p1.y) * smooth) / 6

        parts.push(
            `C ${round(c1x)} ${round(c1y)} ${round(c2x)} ${round(c2y)} ${round(
                p2.x,
            )} ${round(p2.y)}`,
        )
    }
    if (closed) parts.push("Z")

    return parts.join(" ")
}

export const renderSvg = (params: {
    points: Point[]
    closed: boolean
    page: Page
    strokeWidthMm: number
    smooth: number
    title: string
}): string => {
    const { points, closed, page, strokeWidthMm, smooth, title } = params
    const width = round(page.widthMm)
    const height = round(page.heightMm)

    return [
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}mm" height="${height}mm" viewBox="0 0 ${width} ${height}">`,
        `<title>${title}</title>`,
        `<rect width="${width}" height="${height}" fill="#ffffff"/>`,
        `<path d="${buildPathData(points, closed, smooth)}" fill="none" stroke="#000000" stroke-width="${strokeWidthMm}" stroke-linecap="round" stroke-linejoin="round"/>`,
        `</svg>`,
        "",
    ].join("\n")
}

export const writeOutputs = async (params: {
    basePath: string
    svg: string
    page: Page
    previewWidth: number
}): Promise<void> => {
    const { basePath, svg, page, previewWidth } = params
    mkdirSync(dirname(basePath), { recursive: true })

    const svgPath = `${basePath}.svg`
    writeFileSync(svgPath, svg)

    const density = Math.min(
        2400,
        Math.max(72, (previewWidth * 25.4) / page.widthMm),
    )
    const pngPath = `${basePath}.png`
    await sharp(Buffer.from(svg), { density })
        .resize({ width: previewWidth })
        .png({ compressionLevel: 9 })
        .toFile(pngPath)

    console.log(`  vector  ${svgPath}`)
    console.log(`  preview ${pngPath}`)
}

export const reportPath = (points: Point[], closed: boolean): void => {
    const lengthMm = pathLengthMm(points, closed)
    console.log(`  points  ${points.length.toLocaleString("en-GB")}`)
    console.log(
        `  line    ${(lengthMm / 1000).toFixed(1)} m of continuous stroke${
            closed ? " (closed loop)" : ""
        }`,
    )
}
