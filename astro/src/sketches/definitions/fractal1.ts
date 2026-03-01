import type p5 from "p5"
import { createSketch } from "../sketchCommon"

const MAX_DEPTH = 12
const SCALE = 0.72
const PADDING = 0.08

function drawNestedRects(
    scope: p5,
    x: number,
    y: number,
    w: number,
    h: number,
    depth: number,
) {
    if (depth <= 0 || w < 4 || h < 4) return

    const hue = (280 - depth * 22 + scope.frameCount * 0.3) % 360
    scope.stroke(hue, 70, 90, 0.95)
    scope.strokeWeight(Math.max(0.8, 2 - depth * 0.12))
    scope.rect(x, y, w, h)

    const padX = w * PADDING
    const padY = h * PADDING
    const innerW = (w - 2 * padX) * SCALE
    const innerH = (h - 2 * padY) * SCALE
    const innerX = x + (w - innerW) / 2
    const innerY = y + (h - innerH) / 2

    drawNestedRects(scope, innerX, innerY, innerW, innerH, depth - 1)
}

export default createSketch({
    setup(scope) {
        const { noFill } = scope
        noFill()
    },
    draw(scope) {
        const { background, width, height } = scope
        background(260, 12, 98)

        const margin = Math.min(width, height) * 0.06
        const w = width - 2 * margin
        const h = height - 2 * margin

        drawNestedRects(scope, margin, margin, w, h, MAX_DEPTH)
    },
})
