import { createSketch } from "../sketchCommon"

export default createSketch({
    setup(scope) {
        const { noFill } = scope
        noFill()
    },
    draw(scope) {
        const { background, noise, stroke, beginShape, endShape, vertex, map, width, height, frameCount } = scope
        background(220, 14, 96)

        const rows = 52
        const amplitude = Math.min(90, height * 0.14)
        const t = frameCount * 0.0025

        for (let row = 0; row < rows; row++) {
            const depth = row / Math.max(1, rows - 1)
            const yBase = map(depth, 0, 1, height * 0.08, height * 0.92)

            stroke(210 + depth * 20, 58, 28 + depth * 30, 0.9)
            beginShape()
            for (let x = 0; x <= width; x += 12) {
                const waveNoise = noise(x * 0.0034, row * 0.08, t)
                const yOffset = (waveNoise - 0.5) * amplitude * (0.25 + depth)
                vertex(x, yBase + yOffset)
            }
            endShape()
        }
    },
})
