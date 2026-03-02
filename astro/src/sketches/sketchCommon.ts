import type p5 from "p5"
import type { SketchControls, SketchRegistrar } from "./types"

/** p5 instance wrapped so you can destructure and call methods without a prefix, e.g. const { background, rect } = scope */
export function createScope(p: p5): p5 {
    return new Proxy(p, {
        get(target, prop) {
            const value = (target as unknown as Record<string | symbol, unknown>)[prop]
            return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(target) : value
        },
    }) as p5
}

export interface SketchDefinition {
    setup?: (scope: p5) => void
    draw: (scope: p5, getControls: () => SketchControls) => void
}

export function createSketch(definition: SketchDefinition): SketchRegistrar {
    let canvasElement: HTMLCanvasElement | null = null
    let appliedNoiseSeed: number | null = null

    const fitCanvasToParent = (p: p5) => {
        if (!canvasElement?.parentElement || !document.contains(canvasElement)) return
        const parent = canvasElement.parentElement
        const width = Math.max(1, parent.clientWidth)
        const height = Math.max(1, parent.clientHeight)
        p.resizeCanvas(width, height, true)
    }

    const syncNoiseSeed = (p: p5, getControls: () => SketchControls) => {
        const { noiseSeed } = getControls()
        if (appliedNoiseSeed === noiseSeed) return
        p.noiseSeed(noiseSeed)
        appliedNoiseSeed = noiseSeed
    }

    return (p, getControls) => {
        const scope = createScope(p)

        p.setup = () => {
            const renderer = p.createCanvas(1, 1)
            canvasElement = renderer.elt as HTMLCanvasElement
            p.colorMode(p.HSB, 360, 100, 100, 1)
            fitCanvasToParent(p)
            const parent = canvasElement.parentElement
            if (parent) {
                const resizeObserver = new ResizeObserver(() => fitCanvasToParent(p))
                resizeObserver.observe(parent)
            }
            definition.setup?.(scope)
        }

        p.windowResized = () => {
            fitCanvasToParent(p)
        }

        p.draw = () => {
            syncNoiseSeed(p, getControls)
            definition.draw(scope, getControls)
        }
    }
}
