import type { SketchModule } from "./types"

const sketchModules = import.meta.glob<SketchModule>("./definitions/*.ts")

/** Maps collection entry id (e.g. "flow-field") to module path (e.g. "./definitions/flowField.ts") */
export function slugToModulePath(slug: string): string {
    const filename = slug
        .split("-")
        .map((part, i) => (i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
        .join("")
    return `./definitions/${filename}.ts`
}

export async function loadSketchModule(slug: string): Promise<SketchModule | null> {
    const modulePath = slugToModulePath(slug)
    const loader = sketchModules[modulePath]
    if (!loader) return null
    return loader()
}
