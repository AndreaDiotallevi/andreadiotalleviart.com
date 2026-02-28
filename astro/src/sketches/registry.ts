import {
    DEFAULT_SKETCH_CONTROLS,
    mergeSketchControls,
    type SketchModule,
    type SketchRegistryItem,
    type SketchControls,
} from "./types"

const sketchModules = import.meta.glob<SketchModule>("./definitions/*.ts")

const registry: SketchRegistryItem[] = [
    {
        slug: "flow-field",
        title: "Flow Field",
        date: "2026-02-28",
        modulePath: "./definitions/flowField.ts",
        defaultControls: {
            reverse: false,
            noiseSeed: 1823,
        },
    },
    {
        slug: "noise-dunes",
        title: "Noise Dunes",
        date: "2026-02-20",
        modulePath: "./definitions/noiseDunes.ts",
        defaultControls: {
            reverse: false,
            noiseSeed: 927,
        },
    },
]

const toTimestamp = (value: string): number => {
    const parsedValue = Date.parse(value)
    return Number.isNaN(parsedValue) ? 0 : parsedValue
}

export const sketchRegistry = [...registry].sort((a, b) => toTimestamp(b.date) - toTimestamp(a.date))

export function getSketchBySlug(slug: string): SketchRegistryItem | undefined {
    return sketchRegistry.find(sketch => sketch.slug === slug)
}

export function getLatestSketch(): SketchRegistryItem | undefined {
    return sketchRegistry[0]
}

export function getDefaultControlsForSketch(slug: string): SketchControls {
    const sketch = getSketchBySlug(slug)
    if (!sketch) return DEFAULT_SKETCH_CONTROLS
    return mergeSketchControls(sketch.defaultControls, DEFAULT_SKETCH_CONTROLS)
}

export async function loadSketchModule(slug: string): Promise<SketchModule | null> {
    const sketch = getSketchBySlug(slug)
    if (!sketch) return null

    const loader = sketchModules[sketch.modulePath]
    if (!loader) return null

    return loader()
}
