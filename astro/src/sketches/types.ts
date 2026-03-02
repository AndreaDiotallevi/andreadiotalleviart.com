import type p5 from "p5"

export interface SketchControls {
    noiseSeed: number
    randomSeed: number
}

export type SketchRegistrar = (p: p5, getControls: () => SketchControls) => void

export interface SketchModule {
    default: SketchRegistrar
}

export const DEFAULT_SKETCH_CONTROLS: SketchControls = {
    noiseSeed: 1234,
    randomSeed: 5678,
}

export function mergeSketchControls(
    overrides: Partial<SketchControls> = {},
    base: SketchControls = DEFAULT_SKETCH_CONTROLS,
): SketchControls {
    const parsedNoiseSeed = Number.isFinite(overrides.noiseSeed)
        ? Math.trunc(overrides.noiseSeed as number)
        : base.noiseSeed
    const parsedRandomSeed = Number.isFinite(overrides.randomSeed)
        ? Math.trunc(overrides.randomSeed as number)
        : base.randomSeed

    return {
        noiseSeed: parsedNoiseSeed,
        randomSeed: parsedRandomSeed,
    }
}
