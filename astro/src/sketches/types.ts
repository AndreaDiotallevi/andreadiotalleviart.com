import type p5 from "p5"

export interface SketchControls {
    reverse: boolean
    noiseSeed: number
}

export interface SketchRegistryItem {
    slug: string
    title: string
    date: string
    modulePath: string
    defaultControls?: Partial<SketchControls>
}

export type SketchRegistrar = (p: p5, getControls: () => SketchControls) => void

export interface SketchModule {
    default: SketchRegistrar
}

export const DEFAULT_SKETCH_CONTROLS: SketchControls = {
    reverse: false,
    noiseSeed: 1234,
}

export function mergeSketchControls(
    overrides: Partial<SketchControls> = {},
    base: SketchControls = DEFAULT_SKETCH_CONTROLS,
): SketchControls {
    const parsedNoiseSeed = Number.isFinite(overrides.noiseSeed)
        ? Math.trunc(overrides.noiseSeed as number)
        : base.noiseSeed

    return {
        reverse: typeof overrides.reverse === "boolean" ? overrides.reverse : base.reverse,
        noiseSeed: parsedNoiseSeed,
    }
}
