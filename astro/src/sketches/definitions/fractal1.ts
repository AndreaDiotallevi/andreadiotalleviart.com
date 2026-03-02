import type p5 from "p5"
import { createSketch } from "../sketchCommon"

const MAX_DEPTH = 12
const INNER_BASE_START = 0.12
const INNER_BASE_END = 0.88

function drawNestedTriangles(
    scope: p5,
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    depth: number,
) {
    const { stroke, strokeWeight, triangle: drawTriangle } = scope
    if (depth <= 0) return

    stroke(0, 0, 0)
    strokeWeight(Math.max(0.8, 2.5 - depth * 0.25))
    drawTriangle(x0, y0, x1, y1, x2, y2)

    const baseLeftX = x0 + (x1 - x0) * INNER_BASE_START
    const baseLeftY = y0 + (y1 - y0) * INNER_BASE_START
    const baseRightX = x0 + (x1 - x0) * INNER_BASE_END
    const baseRightY = y0 + (y1 - y0) * INNER_BASE_END
    const apexX = (x0 + x1 + x2) / 3
    const apexY = (y0 + y1 + y2) / 3

    drawNestedTriangles(
        scope,
        baseLeftX,
        baseLeftY,
        baseRightX,
        baseRightY,
        apexX,
        apexY,
        depth - 1,
    )
}

export default createSketch({
    setup(scope) {
        const { noFill } = scope
        noFill()
    },
    draw(scope) {
        const { background, width, height } = scope
        background(0, 0, 85)

        const cx = width / 2
        const cy = height / 2
        const r = Math.min(width, height) * 0.42

        const h = r * 0.75
        const x0 = cx
        const y0 = cy - (4 * h) / 3
        const x1 = cx - r * (Math.sqrt(3) / 2)
        const y1 = cy + (2 * h) / 3
        const x2 = cx + r * (Math.sqrt(3) / 2)
        const y2 = cy + (2 * h) / 3

        drawNestedTriangles(scope, x0, y0, x1, y1, x2, y2, MAX_DEPTH)
    },
})
