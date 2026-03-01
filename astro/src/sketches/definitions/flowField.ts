import { createSketch } from "../sketchCommon"

const step = 18

export default createSketch({
    setup(p) {
        p.noFill()
        p.strokeWeight(1.2)
    },
    draw(p, getControls) {
        const { reverse } = getControls()
        p.background(212, 15, reverse ? 10 : 97)

        const direction = reverse ? -1 : 1
        const animationTime = p.frameCount * 0.004

        for (let y = step; y < p.height; y += step) {
            for (let x = step; x < p.width; x += step) {
                const value = p.noise(x * 0.004, y * 0.004, animationTime)
                const angle = value * p.TWO_PI * 2.4 * direction
                const segmentLength = step * 0.8
                const x2 = x + Math.cos(angle) * segmentLength
                const y2 = y + Math.sin(angle) * segmentLength

                const hue = (value * 260 + p.frameCount * 0.25) % 360
                p.stroke(hue, reverse ? 35 : 68, reverse ? 96 : 30, 0.82)
                p.line(x, y, x2, y2)
            }
        }
    },
})
