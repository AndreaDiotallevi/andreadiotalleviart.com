import { Args, readFlag, readNumber, readString } from "./cli"
import { ToneOptions } from "./image"
import { PaperOptions } from "./path"

export type CommonOptions = ToneOptions &
    PaperOptions & {
        input: string
        output: string
        seed: number
    }

export type CommonDefaults = Partial<CommonOptions>

export const readCommonOptions = (
    args: Args,
    name: string,
    defaults: CommonDefaults = {},
): CommonOptions => ({
    input: readString(args, "input", defaults.input ?? "input/portrait.png"),
    output: readString(args, "output", defaults.output ?? `output/${name}`),
    resolution: readNumber(args, "resolution", defaults.resolution ?? 900),
    gamma: readNumber(args, "gamma", defaults.gamma ?? 1),
    minInk: readNumber(args, "min-ink", defaults.minInk ?? 0.03),
    maxInk: readNumber(args, "max-ink", defaults.maxInk ?? 0.97),
    blur: readNumber(args, "blur", defaults.blur ?? 0),
    invert: readFlag(args, "invert", defaults.invert ?? false),
    pageWidthMm: readNumber(args, "page-width", defaults.pageWidthMm ?? 297),
    marginMm: readNumber(args, "margin", defaults.marginMm ?? 15),
    strokeWidthMm: readNumber(args, "stroke", defaults.strokeWidthMm ?? 0.3),
    smooth: readNumber(args, "smooth", defaults.smooth ?? 0),
    previewWidth: readNumber(
        args,
        "preview-width",
        defaults.previewWidth ?? 1000,
    ),
    seed: readNumber(args, "seed", defaults.seed ?? 1),
})

export const describeRun = (title: string, options: CommonOptions): void => {
    console.log(`\n${title}`)
    console.log(`  input   ${options.input}`)
}
