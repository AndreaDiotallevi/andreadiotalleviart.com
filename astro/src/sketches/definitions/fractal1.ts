import type p5 from "p5"
import { createSketch } from "../sketchCommon"

const MAX_DEPTH = 10
const BRANCH_SCALE_MIN = 0.58
const BRANCH_SCALE_MAX = 0.78
const BRANCH_SPREAD_MIN = 0.25
const BRANCH_SPREAD_MAX = 0.58
const TRUNK_LENGTH_RATIO = 0.22

function drawBranch(
    scope: p5,
    x: number,
    y: number,
    angle: number,
    length: number,
    depth: number,
) {
    const { stroke, strokeWeight, line, random, frameCount } = scope
    if (depth <= 0 || length < 2) return

    const x2 = x + Math.cos(angle) * length
    const y2 = y + Math.sin(angle) * length

    const hue = (120 - depth * 8 + frameCount * 0.15) % 360
    stroke(hue, 55, 40, 0.9)
    strokeWeight(Math.max(1, 4 - depth * 0.35))
    line(x, y, x2, y2)

    const spreadLeft = random(BRANCH_SPREAD_MIN, BRANCH_SPREAD_MAX)
    const spreadRight = random(BRANCH_SPREAD_MIN, BRANCH_SPREAD_MAX)
    const scaleLeft = random(BRANCH_SCALE_MIN, BRANCH_SCALE_MAX)
    const scaleRight = random(BRANCH_SCALE_MIN, BRANCH_SCALE_MAX)

    drawBranch(scope, x2, y2, angle - spreadLeft, length * scaleLeft, depth - 1)
    drawBranch(scope, x2, y2, angle + spreadRight, length * scaleRight, depth - 1)
}

export default createSketch({
    setup(scope) {
        const { noFill } = scope
        noFill()
    },
    draw(scope, getControls) {
        const { background, width, height, randomSeed } = scope
        randomSeed(getControls().randomSeed)
        background(200, 18, 98)

        const trunkLength = Math.min(width, height) * TRUNK_LENGTH_RATIO
        const startX = width / 2
        const startY = height * 0.92
        const trunkAngle = -Math.PI / 2

        drawBranch(scope, startX, startY, trunkAngle, trunkLength, MAX_DEPTH)
    },
})
