// Option 4 — serpentine engraving line.
//
// One stroke sweeps left to right, drops a row, sweeps back, and never lifts. Tone is
// carried by a wave whose amplitude and wavelength are driven by the pixel underneath:
// dark areas wobble hard and fast so more ink lands per square millimetre, light areas
// flatten out to nearly a straight line. Phase is integrated rather than evaluated from
// x, otherwise every change of wavelength would tear the wave apart.

import { parseArgs, readNumber } from "./lib/cli"
import { loadInkMap, sampleField } from "./lib/image"
import { describeRun, readCommonOptions } from "./lib/options"
import {
    createPage,
    Point,
    renderSvg,
    reportPath,
    simplify,
    toPage,
    writeOutputs,
} from "./lib/path"

const smoothStep = (edge0: number, edge1: number, value: number): number => {
    const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)))
    return t * t * (3 - 2 * t)
}

const handler = async () => {
    const args = parseArgs(process.argv.slice(2))
    const options = readCommonOptions(args, "04-serpentine", {
        gamma: 1.1,
        minInk: 0.06,
        maxInk: 0.92,
        strokeWidthMm: 0.28,
    })

    const rows = Math.round(readNumber(args, "rows", 120))
    const wavelength = readNumber(args, "wavelength", 9)
    const frequencyBoost = readNumber(args, "freq-boost", 2.6)
    const amplitudeScale = readNumber(args, "amplitude", 1)
    const taper = readNumber(args, "taper", 12)
    // Fine enough to resolve the shortest wavelength the boost can produce.
    const stepPx = readNumber(args, "step", 0.22)

    describeRun("Option 4 — serpentine engraving line", options)

    const ink = await loadInkMap(options.input, options)
    const spacing = ink.height / rows
    const maxAmplitude = (spacing / 2) * amplitudeScale

    const trail: Point[] = []
    let phase = 0

    for (let row = 0; row < rows; row++) {
        const baseline = spacing * (row + 0.5)
        const leftToRight = row % 2 === 0
        const from = leftToRight ? 0 : ink.width - 1
        const to = leftToRight ? ink.width - 1 : 0
        const direction = leftToRight ? 1 : -1

        for (
            let x = from;
            leftToRight ? x <= to : x >= to;
            x += direction * stepPx
        ) {
            const darkness = sampleField(ink, x, baseline)
            const localWavelength = wavelength / (1 + darkness * frequencyBoost)
            phase += (Math.PI * 2 * stepPx) / localWavelength

            // Fade the wave out at both ends of the row so the vertical link between
            // rows meets a flat line rather than a spike.
            const edgeFade =
                smoothStep(0, taper, x) *
                smoothStep(0, taper, ink.width - 1 - x)

            const amplitude = maxAmplitude * darkness * edgeFade
            trail.push({ x, y: baseline + Math.sin(phase) * amplitude })
        }
    }

    const page = createPage(
        ink.width,
        ink.height,
        options.pageWidthMm,
        options.marginMm,
    )
    const points = simplify(
        trail.map(point => toPage(page, point.x, point.y)),
        0.02,
    )

    console.log(`  rows    ${rows} sweeps at ${spacing.toFixed(2)} px pitch`)
    reportPath(points, false)

    await writeOutputs({
        basePath: options.output,
        svg: renderSvg({
            points,
            closed: false,
            page,
            strokeWidthMm: options.strokeWidthMm,
            smooth: options.smooth,
            title: "Serpentine engraved portrait",
        }),
        page,
        previewWidth: options.previewWidth,
    })
}

handler()
