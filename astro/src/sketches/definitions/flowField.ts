import { createSketch } from "../sketchCommon"

const step = 18

export default createSketch({
    setup(scope) {
        const { noFill, strokeWeight } = scope
        noFill()
        strokeWeight(1.2)
    },
    draw(scope) {
        const { background, noise, stroke, line, width, height, frameCount, TWO_PI } = scope
        background(212, 15, 97)

        const animationTime = frameCount * 0.004

        for (let y = step; y < height; y += step) {
            for (let x = step; x < width; x += step) {
                const value = noise(x * 0.004, y * 0.004, animationTime)
                const angle = value * TWO_PI * 2.4
                const segmentLength = step * 0.8
                const x2 = x + Math.cos(angle) * segmentLength
                const y2 = y + Math.sin(angle) * segmentLength

                const hue = (value * 260 + frameCount * 0.25) % 360
                stroke(hue, 68, 30, 0.82)
                line(x, y, x2, y2)
            }
        }
    },
})
