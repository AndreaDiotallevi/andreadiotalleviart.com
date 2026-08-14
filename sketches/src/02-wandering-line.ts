// Option 2 — one adaptive wandering line.
//
// A single pen walks the paper. At every step it looks a short way ahead in a fan of
// possible directions and commits to the most rewarding one: darker where ink is still
// owed, aligned with features, and not doubling back on itself. Ink it lays down is
// subtracted from what the portrait still wants, so the line is pulled back towards
// shadows and away from areas it has already covered.

import { parseArgs, readNumber } from "./lib/cli"
import {
    Field,
    gradientMagnitude,
    gradientVectors,
    loadInkMap,
    sampleField,
} from "./lib/image"
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
import { createRandom } from "./lib/random"

const BLOCK = 16

type Canvas = {
    residual: Float32Array
    blocks: Float64Array
    blockCols: number
    blockRows: number
    total: number
    width: number
    height: number
}

const createCanvas = (target: Field): Canvas => {
    const blockCols = Math.ceil(target.width / BLOCK)
    const blockRows = Math.ceil(target.height / BLOCK)
    const blocks = new Float64Array(blockCols * blockRows)
    const residual = Float32Array.from(target.values)

    let total = 0
    for (let y = 0; y < target.height; y++) {
        for (let x = 0; x < target.width; x++) {
            const value = residual[y * target.width + x]
            total += value
            blocks[Math.floor(y / BLOCK) * blockCols + Math.floor(x / BLOCK)] +=
                value
        }
    }

    return {
        residual,
        blocks,
        blockCols,
        blockRows,
        total,
        width: target.width,
        height: target.height,
    }
}

// Lay ink as a flat disc the width of the nib, and keep the coarse block sums in step so
// the "where is there still work to do" search stays cheap. Flat rather than feathered
// matters: with a soft brush a black region needs dozens of passes before it stops
// asking for more, and the pen never leaves it.
const deposit = (
    canvas: Canvas,
    x: number,
    y: number,
    radius: number,
    strength: number,
): void => {
    const left = Math.max(0, Math.floor(x - radius))
    const right = Math.min(canvas.width - 1, Math.ceil(x + radius))
    const top = Math.max(0, Math.floor(y - radius))
    const bottom = Math.min(canvas.height - 1, Math.ceil(y + radius))

    for (let py = top; py <= bottom; py++) {
        for (let px = left; px <= right; px++) {
            if (Math.hypot(px + 0.5 - x, py + 0.5 - y) > radius) continue

            const index = py * canvas.width + px
            const before = canvas.residual[index]
            if (before <= 0) continue

            const removed = Math.min(before, strength)
            canvas.residual[index] = before - removed
            canvas.blocks[
                Math.floor(py / BLOCK) * canvas.blockCols +
                    Math.floor(px / BLOCK)
            ] -= removed
            canvas.total -= removed
        }
    }
}

// Nearest worthwhile cluster of unpainted ink, biased towards close work so the
// travelling stroke stays short and unobtrusive.
const findWork = (canvas: Canvas, x: number, y: number): Point | null => {
    let best = -1
    let bestX = 0
    let bestY = 0

    for (let by = 0; by < canvas.blockRows; by++) {
        for (let bx = 0; bx < canvas.blockCols; bx++) {
            const weight = canvas.blocks[by * canvas.blockCols + bx]
            if (weight <= 0.5) continue

            const cx = bx * BLOCK + BLOCK / 2
            const cy = by * BLOCK + BLOCK / 2
            const reach = Math.hypot(cx - x, cy - y)
            const score = weight / (reach * reach + 400)
            if (score > best) {
                best = score
                bestX = cx
                bestY = cy
            }
        }
    }

    return best < 0 ? null : { x: bestX, y: bestY }
}

const handler = async () => {
    const args = parseArgs(process.argv.slice(2))
    const options = readCommonOptions(args, "02-wandering-line", {
        gamma: 0.85,
        minInk: 0.1,
        maxInk: 0.92,
        strokeWidthMm: 0.25,
    })

    const steps = Math.round(readNumber(args, "steps", 160000))
    const stepLength = readNumber(args, "step", 1.7)
    const brush = readNumber(args, "brush", 1.6)
    // Roughly "one pass satisfies a mid tone, black wants two or three".
    const strength = readNumber(args, "strength", 0.4)
    const lookAhead = Math.round(readNumber(args, "look", 7))
    const candidates = Math.round(readNumber(args, "candidates", 15))
    const maxTurn = (readNumber(args, "max-turn", 40) * Math.PI) / 180
    const edgeWeight = readNumber(args, "edges", 0.6)
    const straightWeight = readNumber(args, "straight", 0.3)

    describeRun("Option 2 — adaptive wandering line", options)

    const ink = await loadInkMap(options.input, options)
    const edges = gradientMagnitude(ink)
    const gradient = gradientVectors(ink)
    const canvas = createCanvas(ink)
    const random = createRandom(options.seed)
    const startingInk = canvas.total

    const start = findWork(canvas, ink.width / 2, ink.height / 2)
    let x = start ? start.x : ink.width / 2
    let y = start ? start.y : ink.height / 2
    let heading = random() * Math.PI * 2
    let travelTo: Point | null = null

    const trail: Point[] = [{ x, y }]

    for (let step = 0; step < steps; step++) {
        if (canvas.total < startingInk * 0.02) {
            console.log(`  walk    ink exhausted after ${step} steps`)
            break
        }

        let bestScore = -Infinity
        let bestHeading = heading

        for (let candidate = 0; candidate < candidates; candidate++) {
            const offset =
                candidates === 1
                    ? 0
                    : (candidate / (candidates - 1) - 0.5) * 2 * maxTurn
            const angle = heading + offset
            const dx = Math.cos(angle)
            const dy = Math.sin(angle)

            let score = 0
            let outside = false

            for (let ahead = 1; ahead <= lookAhead; ahead++) {
                const sx = x + dx * stepLength * ahead
                const sy = y + dy * stepLength * ahead
                if (
                    sx < 1 ||
                    sy < 1 ||
                    sx > canvas.width - 2 ||
                    sy > canvas.height - 2
                ) {
                    outside = true
                    break
                }

                const owed =
                    canvas.residual[
                        Math.floor(sy) * canvas.width + Math.floor(sx)
                    ]
                if (owed <= 0) continue

                // Following a feature is only rewarded where ink is still owed,
                // otherwise the pen finds an edge and orbits it forever.
                let reward = owed
                const magnitude = sampleField(edges, sx, sy)
                if (magnitude > 0.02) {
                    const gx = sampleField(gradient.x, sx, sy)
                    const gy = sampleField(gradient.y, sx, sy)
                    const slope = Math.hypot(gx, gy)
                    if (slope > 1e-6) {
                        const alignment = Math.abs((dx * -gy + dy * gx) / slope)
                        reward *= 1 + alignment * magnitude * edgeWeight
                    }
                }
                score += reward / ahead
            }
            if (outside) continue

            if (travelTo) {
                // While travelling, reward pointing at the target instead of tone.
                const wanted = Math.atan2(travelTo.y - y, travelTo.x - x)
                const difference = Math.abs(
                    Math.atan2(
                        Math.sin(angle - wanted),
                        Math.cos(angle - wanted),
                    ),
                )
                score += (Math.PI - difference) * 3
            }

            score -= (Math.abs(offset) / maxTurn) * straightWeight
            score += random() * 1e-3

            if (score > bestScore) {
                bestScore = score
                bestHeading = angle
            }
        }

        if (bestScore === -Infinity) {
            // Cornered against the edge of the sheet, turn back inwards.
            heading = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
            continue
        }

        heading = bestHeading
        x += Math.cos(heading) * stepLength
        y += Math.sin(heading) * stepLength
        deposit(canvas, x, y, brush, strength)
        trail.push({ x, y })

        if (travelTo) {
            const arrived = Math.hypot(travelTo.x - x, travelTo.y - y) < BLOCK
            if (
                arrived ||
                canvas.residual[Math.floor(y) * canvas.width + Math.floor(x)] >
                    0.2
            ) {
                travelTo = null
            }
        } else if (bestScore < 0.05) {
            travelTo = findWork(canvas, x, y)
        }
    }

    console.log(
        `  walk    ${((1 - canvas.total / startingInk) * 100).toFixed(
            1,
        )}% of the requested ink laid down`,
    )

    const page = createPage(
        ink.width,
        ink.height,
        options.pageWidthMm,
        options.marginMm,
    )
    const points = simplify(
        trail.map(point => toPage(page, point.x, point.y)),
        0.04,
    )

    reportPath(points, false)

    await writeOutputs({
        basePath: options.output,
        svg: renderSvg({
            points,
            closed: false,
            page,
            strokeWidthMm: options.strokeWidthMm,
            smooth: options.smooth,
            title: "Wandering line portrait",
        }),
        page,
        previewWidth: options.previewWidth,
    })
}

handler()
