// Option 3 — continuous contour drawing.
//
// The portrait is sliced into tonal bands and the boundary of every band is traced with
// marching squares, giving a topographic map of the face. Those separate loops are then
// chained into one stroke: the pen always enters a loop at the vertex closest to where
// it currently is, so the straight bridges between loops stay as short as possible.

import { parseArgs, readNumber } from "./lib/cli"
import { buildConsumableGrid, consume, nearestRemaining } from "./lib/grid"
import { blurField, Field, loadInkMap } from "./lib/image"
import { describeRun, readCommonOptions } from "./lib/options"
import {
    createPage,
    Point,
    renderSvg,
    reportPath,
    simplify,
    toPage,
    writeOutputs,
} from "./lib/path"

type Segment = { ax: number; ay: number; bx: number; by: number }

type Contour = {
    points: Point[]
    closed: boolean
}

const key = (x: number, y: number): string =>
    `${Math.round(x * 512)}:${Math.round(y * 512)}`

// Standard 16 case marching squares. Corner bits are top left, top right, bottom
// right, bottom left; the two saddle cases emit both crossings.
const isoSegments = (field: Field, threshold: number): Segment[] => {
    const { width, height, values } = field
    const segments: Segment[] = []

    for (let y = 0; y < height - 1; y++) {
        for (let x = 0; x < width - 1; x++) {
            const topLeft = values[y * width + x]
            const topRight = values[y * width + x + 1]
            const bottomRight = values[(y + 1) * width + x + 1]
            const bottomLeft = values[(y + 1) * width + x]

            let code = 0
            if (topLeft > threshold) code |= 1
            if (topRight > threshold) code |= 2
            if (bottomRight > threshold) code |= 4
            if (bottomLeft > threshold) code |= 8
            if (code === 0 || code === 15) continue

            const cross = (a: number, b: number): number => {
                const span = b - a
                if (Math.abs(span) < 1e-9) return 0.5
                return Math.min(1, Math.max(0, (threshold - a) / span))
            }

            const top = { x: x + cross(topLeft, topRight), y }
            const right = { x: x + 1, y: y + cross(topRight, bottomRight) }
            const bottom = { x: x + cross(bottomLeft, bottomRight), y: y + 1 }
            const left = { x, y: y + cross(topLeft, bottomLeft) }

            const push = (a: Point, b: Point): void => {
                segments.push({ ax: a.x, ay: a.y, bx: b.x, by: b.y })
            }

            switch (code) {
                case 1:
                case 14:
                    push(left, top)
                    break
                case 2:
                case 13:
                    push(top, right)
                    break
                case 3:
                case 12:
                    push(left, right)
                    break
                case 4:
                case 11:
                    push(right, bottom)
                    break
                case 6:
                case 9:
                    push(top, bottom)
                    break
                case 7:
                case 8:
                    push(left, bottom)
                    break
                case 5:
                    push(left, top)
                    push(right, bottom)
                    break
                default:
                    push(top, right)
                    push(left, bottom)
                    break
            }
        }
    }

    return segments
}

// Walk shared endpoints to turn a soup of segments into polylines.
const linkSegments = (segments: Segment[]): Contour[] => {
    const buckets = new Map<string, number[]>()
    const used = new Uint8Array(segments.length)

    const register = (k: string, index: number): void => {
        const bucket = buckets.get(k)
        if (bucket) bucket.push(index)
        else buckets.set(k, [index])
    }

    for (let i = 0; i < segments.length; i++) {
        register(key(segments[i].ax, segments[i].ay), i)
        register(key(segments[i].bx, segments[i].by), i)
    }

    const extend = (from: Point, points: Point[]): void => {
        let cursor = from
        for (;;) {
            const bucket = buckets.get(key(cursor.x, cursor.y))
            if (!bucket) return

            let next = -1
            for (const candidate of bucket) {
                if (!used[candidate]) {
                    next = candidate
                    break
                }
            }
            if (next < 0) return

            used[next] = 1
            const segment = segments[next]
            const atA = key(segment.ax, segment.ay) === key(cursor.x, cursor.y)
            cursor = atA
                ? { x: segment.bx, y: segment.by }
                : { x: segment.ax, y: segment.ay }
            points.push(cursor)
        }
    }

    const contours: Contour[] = []
    for (let i = 0; i < segments.length; i++) {
        if (used[i]) continue
        used[i] = 1

        const segment = segments[i]
        const start = { x: segment.ax, y: segment.ay }
        const forward: Point[] = [{ x: segment.bx, y: segment.by }]
        extend(forward[forward.length - 1], forward)

        const backward: Point[] = []
        extend(start, backward)
        backward.reverse()

        const points = [...backward, start, ...forward]
        const head = points[0]
        const tail = points[points.length - 1]
        const closed =
            points.length > 3 &&
            Math.hypot(tail.x - head.x, tail.y - head.y) < 1e-6

        if (closed) points.pop()
        contours.push({ points, closed })
    }

    return contours
}

const contourLength = (contour: Contour): number => {
    let total = 0
    const segments = contour.closed
        ? contour.points.length
        : contour.points.length - 1
    for (let i = 0; i < segments; i++) {
        const a = contour.points[i]
        const b = contour.points[(i + 1) % contour.points.length]
        total += Math.hypot(b.x - a.x, b.y - a.y)
    }
    return total
}

// Chain every contour into one stroke. Closed loops are rotated so drawing starts and
// ends at the vertex nearest the pen, which is what keeps the bridges short.
const stitch = (
    contours: Contour[],
    width: number,
    height: number,
): Point[] => {
    let vertexCount = 0
    for (const contour of contours) vertexCount += contour.points.length

    const xs = new Float64Array(vertexCount)
    const ys = new Float64Array(vertexCount)
    const owner = new Int32Array(vertexCount)
    const offset = new Int32Array(vertexCount)
    const firstVertex = new Int32Array(contours.length)

    let cursor = 0
    for (let c = 0; c < contours.length; c++) {
        const points = contours[c].points
        firstVertex[c] = cursor
        for (let i = 0; i < points.length; i++) {
            xs[cursor] = points[i].x
            ys[cursor] = points[i].y
            owner[cursor] = c
            offset[cursor] = i
            cursor++
        }
    }

    const consumable = buildConsumableGrid(
        xs,
        ys,
        vertexCount,
        width,
        height,
        4,
    )
    const stroke: Point[] = []

    let penX = 0
    let penY = 0
    let remaining = contours.length

    while (remaining > 0) {
        const vertex = nearestRemaining(consumable, penX, penY)
        if (vertex < 0) break

        const index = owner[vertex]
        const contour = contours[index]
        const points = contour.points

        let ordered: Point[]
        if (contour.closed) {
            const entry = offset[vertex]
            ordered = []
            for (let i = 0; i <= points.length; i++) {
                ordered.push(points[(entry + i) % points.length])
            }
        } else {
            const head = points[0]
            const tail = points[points.length - 1]
            const fromHead = Math.hypot(head.x - penX, head.y - penY)
            const fromTail = Math.hypot(tail.x - penX, tail.y - penY)
            ordered = fromHead <= fromTail ? points : [...points].reverse()
        }

        for (const point of ordered) stroke.push(point)
        const last = ordered[ordered.length - 1]
        penX = last.x
        penY = last.y

        remaining--
        const from = firstVertex[index]
        for (let v = from; v < from + points.length; v++) {
            consume(consumable, v)
        }
    }

    return stroke
}

const handler = async () => {
    const args = parseArgs(process.argv.slice(2))
    const options = readCommonOptions(args, "03-contour-stitch", {
        resolution: 700,
        minInk: 0.1,
        maxInk: 0.92,
        strokeWidthMm: 0.35,
    })

    const levels = Math.round(readNumber(args, "levels", 9))
    const contourBlur = Math.round(readNumber(args, "contour-blur", 4))
    const minLength = readNumber(args, "min-length", 8)
    const tolerance = readNumber(args, "tolerance", 0.4)

    describeRun("Option 3 — continuous contour drawing", options)

    const ink = await loadInkMap(options.input, options)
    const smoothed = blurField(ink, contourBlur)

    const contours: Contour[] = []
    for (let level = 1; level <= levels; level++) {
        const threshold = level / (levels + 1)
        const segments = isoSegments(smoothed, threshold)
        const linked = linkSegments(segments)

        for (const contour of linked) {
            if (contourLength(contour) < minLength) continue
            const reduced = simplify(contour.points, tolerance)
            if (reduced.length < 3) continue
            contours.push({ points: reduced, closed: contour.closed })
        }

        console.log(
            `  level   ${threshold.toFixed(2)} produced ${linked.length} contours`,
        )
    }

    console.log(`  kept    ${contours.length} contours worth drawing`)

    const stroke = stitch(contours, ink.width, ink.height)
    const page = createPage(
        ink.width,
        ink.height,
        options.pageWidthMm,
        options.marginMm,
    )
    const points = stroke.map(point => toPage(page, point.x, point.y))

    reportPath(points, false)

    await writeOutputs({
        basePath: options.output,
        svg: renderSvg({
            points,
            closed: false,
            page,
            strokeWidthMm: options.strokeWidthMm,
            smooth: options.smooth,
            title: "Stitched contour portrait",
        }),
        page,
        previewWidth: options.previewWidth,
    })
}

handler()
