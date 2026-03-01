import { createSketch } from "../sketchCommon"

export default createSketch({
    setup(p) {
        p.noFill()
    },
    draw(p) {
        p.background(220, 14, 96)

        const rows = 52
        const amplitude = Math.min(90, p.height * 0.14)
        const t = p.frameCount * 0.0025

        for (let row = 0; row < rows; row++) {
            const depth = row / Math.max(1, rows - 1)
            const yBase = p.map(depth, 0, 1, p.height * 0.08, p.height * 0.92)

            p.stroke(210 + depth * 20, 58, 28 + depth * 30, 0.9)
            p.beginShape()
            for (let x = 0; x <= p.width; x += 12) {
                const waveNoise = p.noise(x * 0.0034, row * 0.08, t)
                const yOffset = (waveNoise - 0.5) * amplitude * (0.25 + depth)
                p.vertex(x, yBase + yOffset)
            }
            p.endShape()
        }
    },
})
