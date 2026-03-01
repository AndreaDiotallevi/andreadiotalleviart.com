import type p5 from "p5"
import type { SketchControls, SketchRegistrar } from "./types"

export interface SketchDefinition {
    setup?: (p: p5) => void
    draw: (p: p5, getControls: () => SketchControls) => void
}

export function createSketch(definition: SketchDefinition): SketchRegistrar {
    let canvasElement: HTMLCanvasElement | null = null
    let appliedNoiseSeed: number | null = null

    const fitCanvasToParent = (p: p5) => {
        const parent = canvasElement?.parentElement
        if (!parent) return
        const width = Math.max(320, parent.clientWidth)
        const height = Math.max(320, parent.clientHeight)
        p.resizeCanvas(width, height, true)
    }

    const syncNoiseSeed = (p: p5, getControls: () => SketchControls) => {
        const { noiseSeed } = getControls()
        if (appliedNoiseSeed === noiseSeed) return
        p.noiseSeed(noiseSeed)
        appliedNoiseSeed = noiseSeed
    }

    return (p, getControls) => {
        p.setup = () => {
            const renderer = p.createCanvas(1, 1)
            canvasElement = renderer.elt as HTMLCanvasElement
            p.colorMode(p.HSB, 360, 100, 100, 1)
            fitCanvasToParent(p)
            definition.setup?.(p)
        }

        p.windowResized = () => {
            fitCanvasToParent(p)
        }

        p.draw = () => {
            syncNoiseSeed(p, getControls)
            definition.draw(p, getControls)
        }
    }
}
