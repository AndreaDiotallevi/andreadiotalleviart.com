// Option 5 — image modulated space filling curve.
//
// A Hilbert curve is subdivided adaptively: the darker a region, the deeper the
// recursion, so the same single curve packs four times more line into a shadow than
// into a highlight. Because a Hilbert traversal visits each quadrant completely before
// moving to the next, joining the centres of the leaf cells in traversal order gives a
// path that is continuous and never crosses itself, whatever the subdivision.

import { parseArgs, readNumber } from "./lib/cli"
import { buildIntegral, loadInkMap, rectangleAverage } from "./lib/image"
import { describeRun, readCommonOptions } from "./lib/options"
import {
    createPage,
    Point,
    renderSvg,
    reportPath,
    toPage,
    writeOutputs,
} from "./lib/path"
import { createRandom } from "./lib/random"

const handler = async () => {
    const args = parseArgs(process.argv.slice(2))
    const options = readCommonOptions(args, "05-space-filling", {
        resolution: 1024,
        minInk: 0.1,
        maxInk: 0.92,
        strokeWidthMm: 0.25,
        smooth: 0.6,
    })

    const maxDepth = Math.round(readNumber(args, "depth", 9))
    const minDepth = Math.round(readNumber(args, "min-depth", 3))
    // Below 1 this pushes mid tones deeper, which is what stops a face collapsing into
    // the same coarse cells as the blank paper around it.
    const exponent = readNumber(args, "exponent", 0.5)

    describeRun("Option 5 — image modulated space filling curve", options)

    const random = createRandom(options.seed)
    const ink = await loadInkMap(options.input, options)
    const integral = buildIntegral(ink)
    const centres: Point[] = []

    // (xi, xj) and (yi, yj) are the cell's local axes in unit square coordinates.
    // Rotating and flipping them is what threads the four children together.
    const walk = (
        x0: number,
        y0: number,
        xi: number,
        xj: number,
        yi: number,
        yj: number,
        depth: number,
    ): void => {
        const cornerX = x0 + xi + yi
        const cornerY = y0 + xj + yj
        const left = Math.min(x0, cornerX) * ink.width
        const right = Math.max(x0, cornerX) * ink.width
        const top = Math.min(y0, cornerY) * ink.height
        const bottom = Math.max(y0, cornerY) * ink.height

        const darkness = rectangleAverage(
            integral,
            ink,
            left,
            top,
            right,
            bottom,
        )

        // Each extra level quadruples the line density, so rounding the wanted depth
        // would leave visible terraces. Dithering the fractional part against the
        // seeded generator trades those terraces for fine grain.
        const exact =
            minDepth + Math.pow(darkness, exponent) * (maxDepth - minDepth)
        const floor = Math.floor(exact)
        const wanted = random() < exact - floor ? floor + 1 : floor

        if (depth >= Math.min(maxDepth, Math.max(minDepth, wanted))) {
            centres.push({
                x: (x0 + (xi + yi) / 2) * ink.width,
                y: (y0 + (xj + yj) / 2) * ink.height,
            })
            return
        }

        walk(x0, y0, yi / 2, yj / 2, xi / 2, xj / 2, depth + 1)
        walk(
            x0 + xi / 2,
            y0 + xj / 2,
            xi / 2,
            xj / 2,
            yi / 2,
            yj / 2,
            depth + 1,
        )
        walk(
            x0 + xi / 2 + yi / 2,
            y0 + xj / 2 + yj / 2,
            xi / 2,
            xj / 2,
            yi / 2,
            yj / 2,
            depth + 1,
        )
        walk(
            x0 + xi / 2 + yi,
            y0 + xj / 2 + yj,
            -yi / 2,
            -yj / 2,
            -xi / 2,
            -xj / 2,
            depth + 1,
        )
    }

    walk(0, 0, 1, 0, 0, 1, 0)

    console.log(
        `  curve   ${centres.length.toLocaleString(
            "en-GB",
        )} leaf cells between depth ${minDepth} and ${maxDepth}`,
    )

    const page = createPage(
        ink.width,
        ink.height,
        options.pageWidthMm,
        options.marginMm,
    )
    const points = centres.map(point => toPage(page, point.x, point.y))

    reportPath(points, false)

    await writeOutputs({
        basePath: options.output,
        svg: renderSvg({
            points,
            closed: false,
            page,
            strokeWidthMm: options.strokeWidthMm,
            smooth: options.smooth,
            title: "Space filling curve portrait",
        }),
        page,
        previewWidth: options.previewWidth,
    })
}

handler()
