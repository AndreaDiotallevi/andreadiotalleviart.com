import type p5 from "p5"
import { createSketch } from "../sketchCommon"

type HSB = [number, number, number, number]

interface Segment {
    x1: number
    y1: number
    x2: number
    y2: number
    r1: number
    r2: number
    colourStart: HSB
    colourEnd: HSB
}

/** HSB colour palette [hue, saturation, brightness, alpha] */
const COLOUR_PALETTE: HSB[] = [
    [22, 72, 92, 0.9],
    [340, 45, 95, 0.9],
    [185, 55, 88, 0.9],
    [45, 70, 95, 0.9],
    [270, 35, 90, 0.9],
    [160, 50, 85, 0.9],
    [12, 80, 88, 0.9],
    [200, 60, 75, 0.9],
]

const NUM_SEGMENTS = 8
const MIN_RADIUS = 10
const MAX_RADIUS = 58
/** Gaussian mean/sd for radius (clamped to min/max) – smaller so elements don’t fully overlap */
const RADIUS_MEAN = 30
const RADIUS_SD = 14
/** Gaussian mean/sd for ratio of end radii (clamped); >1 = end often bigger, spread = more variety */
const RATIO_MEAN = 1.1
const RATIO_SD = 0.7
const MIN_RATIO = 0.25
const MAX_RATIO = 4.5

/** Convert HSB [h 0–360, s 0–100, b 0–100, a 0–1] to CSS rgba() string */
function hsbToRgba([h, s, b, a]: HSB): string {
    s /= 100
    b /= 100
    const c = b * s
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = b - c
    let r = 0,
        g = 0,
        bl = 0
    if (h < 60) {
        r = c
        g = x
    } else if (h < 120) {
        r = x
        g = c
    } else if (h < 180) {
        g = c
        bl = x
    } else if (h < 240) {
        g = x
        bl = c
    } else if (h < 300) {
        r = x
        bl = c
    } else {
        r = c
        bl = x
    }
    const R = Math.round((r + m) * 255)
    const G = Math.round((g + m) * 255)
    const B = Math.round((bl + m) * 255)
    return `rgba(${R},${G},${B},${a})`
}

function drawCone(
    scope: p5,
    x1: number,
    y1: number,
    r1: number,
    x2: number,
    y2: number,
    r2: number,
    colourStart: HSB,
    colourEnd: HSB,
) {
    const { fill, noStroke, beginShape, endShape, vertex, ellipse, color } = scope
    noStroke()

    const dx = x2 - x1
    const dy = y2 - y1
    const len = Math.hypot(dx, dy) || 1
    const nx = -dy / len
    const ny = dx / len

    const p1x = x1 + r1 * nx
    const p1y = y1 + r1 * ny
    const p2x = x1 - r1 * nx
    const p2y = y1 - r1 * ny
    const p3x = x2 - r2 * nx
    const p3y = y2 - r2 * ny
    const p4x = x2 + r2 * nx
    const p4y = y2 + r2 * ny

    const c1 = color(...colourStart)
    const c2 = color(...colourEnd)

    const renderer = (scope as unknown as { _renderer?: { drawingContext: CanvasRenderingContext2D } })._renderer
    const ctx = renderer?.drawingContext
    if (ctx) {
        const startStyle = hsbToRgba(colourStart)
        const endStyle = hsbToRgba(colourEnd)
        const grad = ctx.createLinearGradient(x1, y1, x2, y2)
        grad.addColorStop(0, startStyle)
        grad.addColorStop(1, endStyle)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.moveTo(p1x, p1y)
        ctx.lineTo(p4x, p4y)
        ctx.lineTo(p3x, p3y)
        ctx.lineTo(p2x, p2y)
        ctx.closePath()
        ctx.fill()
    } else {
        fill(c1)
        beginShape()
        vertex(p1x, p1y)
        vertex(p4x, p4y)
        vertex(p3x, p3y)
        vertex(p2x, p2y)
        endShape(scope.CLOSE)
    }

    fill(c1)
    ellipse(x1, y1, r1 * 2, r1 * 2)
    fill(c2)
    ellipse(x2, y2, r2 * 2, r2 * 2)
}

let segments: Segment[] | null = null
let lastRandomSeed = -1

export default createSketch({
    setup() {},
    draw(scope, getControls) {
        const { background, width, height, random, randomSeed } = scope
        const seed = getControls().randomSeed
        if (seed !== lastRandomSeed) {
            lastRandomSeed = seed
            segments = null
        }

        if (!segments) {
            randomSeed(seed)
            segments = []
            const { randomGaussian, constrain } = scope
            for (let i = 0; i < NUM_SEGMENTS; i++) {
                const palette = COLOUR_PALETTE
                const idx = () => Math.floor(random(palette.length))
                const r1 = constrain(
                    randomGaussian(RADIUS_MEAN, RADIUS_SD),
                    MIN_RADIUS,
                    MAX_RADIUS,
                )
                const ratio = constrain(
                    randomGaussian(RATIO_MEAN, RATIO_SD),
                    MIN_RATIO,
                    MAX_RATIO,
                )
                const r2 = constrain(r1 * ratio, MIN_RADIUS, MAX_RADIUS)
            segments.push({
                    x1: random(width * 0.1, width * 0.9),
                    y1: random(height * 0.1, height * 0.9),
                    x2: random(width * 0.1, width * 0.9),
                    y2: random(height * 0.1, height * 0.9),
                    r1,
                    r2,
                    colourStart: palette[idx()],
                    colourEnd: palette[idx()],
                })
            }
        }

        background(30, 8, 98)

        for (const seg of segments) {
            drawCone(
                scope,
                seg.x1,
                seg.y1,
                seg.r1,
                seg.x2,
                seg.y2,
                seg.r2,
                seg.colourStart,
                seg.colourEnd,
            )
        }
    },
})
