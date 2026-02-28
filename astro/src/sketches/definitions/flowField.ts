import type { SketchRegistrar } from "../types"

const flowFieldSketch: SketchRegistrar = (p, getControls) => {
    const step = 18
    let appliedNoiseSeed: number | null = null

    const fitCanvasToParent = () => {
        const parent = p.canvas?.parentElement
        if (!parent) return

        const width = Math.max(320, parent.clientWidth)
        const height = Math.max(320, parent.clientHeight)
        p.resizeCanvas(width, height, true)
    }

    const syncNoiseSeed = () => {
        const { noiseSeed } = getControls()
        if (appliedNoiseSeed === noiseSeed) return
        p.noiseSeed(noiseSeed)
        appliedNoiseSeed = noiseSeed
    }

    p.setup = () => {
        p.createCanvas(1, 1)
        p.colorMode(p.HSB, 360, 100, 100, 1)
        p.noFill()
        p.strokeWeight(1.2)
        fitCanvasToParent()
    }

    p.windowResized = () => {
        fitCanvasToParent()
    }

    p.draw = () => {
        const { reverse } = getControls()
        syncNoiseSeed()

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
    }
}

export default flowFieldSketch
