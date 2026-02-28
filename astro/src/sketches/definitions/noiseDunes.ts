import type { SketchRegistrar } from "../types"

const noiseDunesSketch: SketchRegistrar = (p, getControls) => {
    let appliedNoiseSeed: number | null = null
    let canvasElement: HTMLCanvasElement | null = null

    const fitCanvasToParent = () => {
        const parent = canvasElement?.parentElement
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
        const renderer = p.createCanvas(1, 1)
        canvasElement = renderer.elt as HTMLCanvasElement
        p.colorMode(p.HSB, 360, 100, 100, 1)
        p.noFill()
        fitCanvasToParent()
    }

    p.windowResized = () => {
        fitCanvasToParent()
    }

    p.draw = () => {
        syncNoiseSeed()

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
    }
}

export default noiseDunesSketch
