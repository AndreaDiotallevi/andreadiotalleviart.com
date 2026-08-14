// Option 1 — weighted points joined by a travelling salesman path.
//
// Tone becomes point density, then a single route visits every point once. Because a
// 2-opt optimal euclidean tour never crosses itself, the drawing reads as one long
// meandering line that thickens where the portrait is dark.

import { parseArgs, readFlag, readNumber, readString } from "./lib/cli"
import {
    buildConsumableGrid,
    buildGrid,
    consume,
    nearest,
    nearestNeighbourLists,
    nearestRemaining,
} from "./lib/grid"
import {
    combineFields,
    Field,
    gradientMagnitude,
    loadInkMap,
    sampleField,
} from "./lib/image"
import { describeRun, readCommonOptions } from "./lib/options"
import {
    createPage,
    Point,
    renderSvg,
    reportPath,
    toPage,
    writeOutputs,
} from "./lib/path"
import { createRandom, Random } from "./lib/random"

const buildCumulative = (field: Field): Float64Array => {
    const cumulative = new Float64Array(field.values.length)
    let running = 0
    for (let i = 0; i < field.values.length; i++) {
        running += field.values[i]
        cumulative[i] = running
    }
    return cumulative
}

// Inverse transform sampling: dark pixels own a longer stretch of the cumulative
// curve, so they attract proportionally more points.
const samplePixel = (cumulative: Float64Array, random: Random): number => {
    const target = random() * cumulative[cumulative.length - 1]
    let low = 0
    let high = cumulative.length - 1
    while (low < high) {
        const middle = (low + high) >>> 1
        if (cumulative[middle] < target) low = middle + 1
        else high = middle
    }
    return low
}

const scatterPoints = (
    field: Field,
    cumulative: Float64Array,
    count: number,
    random: Random,
): { xs: Float64Array; ys: Float64Array } => {
    const xs = new Float64Array(count)
    const ys = new Float64Array(count)
    for (let i = 0; i < count; i++) {
        const pixel = samplePixel(cumulative, random)
        xs[i] = (pixel % field.width) + random()
        ys[i] = Math.floor(pixel / field.width) + random()
    }
    return { xs, ys }
}

// Weighted Voronoi relaxation (Lloyd). Each point drifts to the centre of mass of the
// ink it owns, which spreads the points evenly without losing the tonal weighting.
const relax = (
    xs: Float64Array,
    ys: Float64Array,
    field: Field,
    cumulative: Float64Array,
    iterations: number,
    random: Random,
): void => {
    const count = xs.length
    const inkPixels: number[] = []
    for (let i = 0; i < field.values.length; i++) {
        if (field.values[i] > 0.004) inkPixels.push(i)
    }

    const weight = new Float64Array(count)
    const momentX = new Float64Array(count)
    const momentY = new Float64Array(count)

    for (let iteration = 0; iteration < iterations; iteration++) {
        const grid = buildGrid(xs, ys, count, field.width, field.height)
        weight.fill(0)
        momentX.fill(0)
        momentY.fill(0)

        for (let p = 0; p < inkPixels.length; p++) {
            const pixel = inkPixels[p]
            const px = (pixel % field.width) + 0.5
            const py = Math.floor(pixel / field.width) + 0.5
            const owner = nearest(grid, px, py)
            if (owner < 0) continue
            const value = field.values[pixel]
            weight[owner] += value
            momentX[owner] += value * px
            momentY[owner] += value * py
        }

        let drift = 0
        for (let i = 0; i < count; i++) {
            if (weight[i] > 1e-9) {
                const nx = momentX[i] / weight[i]
                const ny = momentY[i] / weight[i]
                drift += Math.hypot(nx - xs[i], ny - ys[i])
                xs[i] = nx
                ys[i] = ny
            } else {
                const pixel = samplePixel(cumulative, random)
                xs[i] = (pixel % field.width) + random()
                ys[i] = Math.floor(pixel / field.width) + random()
            }
        }

        if (iteration === iterations - 1 || iteration % 6 === 0) {
            console.log(
                `  relax   pass ${iteration + 1}/${iterations}, average drift ${(
                    drift / count
                ).toFixed(3)} px`,
            )
        }
        if (drift / count < 0.01) break
    }
}

// A single point left in an almost blank area forces the tour to detour there and back,
// which shows up as a long stray line across the paper. Drop those points instead.
const cullFaintPoints = (
    xs: Float64Array,
    ys: Float64Array,
    field: Field,
    threshold: number,
): { xs: Float64Array; ys: Float64Array } => {
    const keptX: number[] = []
    const keptY: number[] = []

    for (let i = 0; i < xs.length; i++) {
        if (sampleField(field, xs[i], ys[i]) >= threshold) {
            keptX.push(xs[i])
            keptY.push(ys[i])
        }
    }

    return { xs: Float64Array.from(keptX), ys: Float64Array.from(keptY) }
}

// Hilbert index of a point on a 2^16 grid. Sorting by it gives a starting tour with no
// long jumps anywhere, which is a far better seed for 2-opt than a greedy walk: greedy
// paints itself into corners and leaves stragglers that show up as strays on the paper.
const hilbertIndex = (size: number, px: number, py: number): number => {
    let x = px
    let y = py
    let distance = 0

    for (let s = size / 2; s >= 1; s /= 2) {
        const rx = (x & s) > 0 ? 1 : 0
        const ry = (y & s) > 0 ? 1 : 0
        distance += s * s * ((3 * rx) ^ ry)

        if (ry === 0) {
            if (rx === 1) {
                x = s - 1 - x
                y = s - 1 - y
            }
            const held = x
            x = y
            y = held
        }
    }

    return distance
}

const hilbertTour = (
    xs: Float64Array,
    ys: Float64Array,
    width: number,
    height: number,
): Int32Array => {
    const size = 1 << 16
    const span = Math.max(width, height)
    const keys = new Float64Array(xs.length)

    for (let i = 0; i < xs.length; i++) {
        const gx = Math.min(size - 1, Math.floor((xs[i] / span) * size))
        const gy = Math.min(size - 1, Math.floor((ys[i] / span) * size))
        keys[i] = hilbertIndex(size, gx, gy)
    }

    const order = Int32Array.from({ length: xs.length }, (_, i) => i)
    return order.sort((a, b) => keys[a] - keys[b])
}

const nearestNeighbourTour = (
    xs: Float64Array,
    ys: Float64Array,
    width: number,
    height: number,
): Int32Array => {
    const count = xs.length
    const consumable = buildConsumableGrid(xs, ys, count, width, height)
    const tour = new Int32Array(count)

    let current = 0
    consume(consumable, current)
    tour[0] = current

    for (let i = 1; i < count; i++) {
        const next = nearestRemaining(consumable, xs[current], ys[current])
        if (next < 0)
            throw new Error("Ran out of unvisited points unexpectedly")
        consume(consumable, next)
        tour[i] = next
        current = next
    }

    return tour
}

const tourLength = (
    xs: Float64Array,
    ys: Float64Array,
    tour: Int32Array,
): number => {
    let total = 0
    for (let i = 0; i < tour.length; i++) {
        const a = tour[i]
        const b = tour[(i + 1) % tour.length]
        total += Math.hypot(xs[a] - xs[b], ys[a] - ys[b])
    }
    return total
}

// Local search restricted to each point's nearest neighbours, with "don't look" bits so
// settled regions are skipped. Two move types: 2-opt, which reverses a stretch of the
// tour and is what un-crosses the line, and Or-opt, which lifts a run of one to three
// points and reinserts it elsewhere. Or-opt matters here for looks rather than length:
// it is the move that dissolves the lone long detours the greedy tour leaves behind.
const improveTour = (
    xs: Float64Array,
    ys: Float64Array,
    tour: Int32Array,
    neighbours: Int32Array,
    k: number,
    budgetSeconds: number,
): void => {
    const count = tour.length
    const position = new Int32Array(count)
    for (let i = 0; i < count; i++) position[tour[i]] = i

    const distance = (a: number, b: number): number =>
        Math.hypot(xs[a] - xs[b], ys[a] - ys[b])

    const reverse = (from: number, to: number): void => {
        let inner = ((to - from + count) % count) + 1
        let start = from
        let end = to
        if (inner * 2 > count) {
            start = (to + 1) % count
            end = (from - 1 + count) % count
            inner = count - inner
        }
        for (let step = 0; step < inner >> 1; step++) {
            const a = (start + step) % count
            const b = (end - step + count) % count
            const held = tour[a]
            tour[a] = tour[b]
            tour[b] = held
            position[tour[a]] = a
            position[tour[b]] = b
        }
    }

    const held = new Int32Array(3)

    const moveSegment = (
        start: number,
        length: number,
        after: number,
        reversed: boolean,
    ): void => {
        for (let s = 0; s < length; s++) {
            held[s] = tour[reversed ? start + length - 1 - s : start + s]
        }

        const end = start + length - 1
        if (after > end) {
            for (let k = end + 1; k <= after; k++) tour[k - length] = tour[k]
            for (let s = 0; s < length; s++) {
                tour[after - length + 1 + s] = held[s]
            }
            for (let k = start; k <= after; k++) position[tour[k]] = k
        } else {
            for (let k = start - 1; k >= after + 1; k--)
                tour[k + length] = tour[k]
            for (let s = 0; s < length; s++) tour[after + 1 + s] = held[s]
            for (let k = after + 1; k <= end; k++) position[tour[k]] = k
        }
    }

    const queue: number[] = []
    const queued = new Uint8Array(count)

    const enqueueEveryone = (): void => {
        for (let i = 0; i < count; i++) {
            if (queued[tour[i]]) continue
            queued[tour[i]] = 1
            queue.push(tour[i])
        }
    }

    const deadline = Date.now() + budgetSeconds * 1000
    let head = 0
    let moves = 0
    let visits = 0

    const push = (city: number): void => {
        if (queued[city]) return
        queued[city] = 1
        queue.push(city)
    }

    const tryOrOpt = (a: number): boolean => {
        const start = position[a]

        for (let length = 1; length <= 3; length++) {
            const end = start + length - 1
            if (end >= count - 1) break

            const first = a
            const last = tour[end]
            const before = tour[(start - 1 + count) % count]
            const after = tour[(end + 1) % count]
            if (before === last || after === first) continue

            const freed =
                distance(before, first) +
                distance(last, after) -
                distance(before, after)
            if (freed <= 1e-9) continue

            for (let end0 = 0; end0 < 2; end0++) {
                const anchor = end0 === 0 ? first : last
                for (let slot = 0; slot < k; slot++) {
                    const c = neighbours[anchor * k + slot]
                    if (c < 0) break

                    const at = position[c]
                    if (at >= start && at <= end) continue
                    if (at === start - 1) continue

                    const targetIndex = at + 1 === count ? 0 : at + 1
                    if (targetIndex >= start && targetIndex <= end) continue

                    const target = tour[targetIndex]
                    const base = distance(c, target)
                    const forward =
                        freed +
                        base -
                        distance(c, first) -
                        distance(last, target)
                    const backward =
                        freed +
                        base -
                        distance(c, last) -
                        distance(first, target)
                    const gain = Math.max(forward, backward)
                    if (gain <= 1e-9) continue

                    moveSegment(start, length, at, backward > forward)
                    push(before)
                    push(after)
                    push(first)
                    push(last)
                    push(c)
                    push(target)
                    return true
                }
            }
        }

        return false
    }

    // Draining the queue once only reaches the first local optimum. Sweeping again from
    // scratch keeps finding moves for a few rounds, and those late moves are mostly the
    // ones that tidy away stray lines across blank areas.
    let sweep = 0
    let exhausted = false

    while (!exhausted) {
        const before = moves
        enqueueEveryone()

        while (head < queue.length) {
            if ((visits++ & 0x3ff) === 0 && Date.now() > deadline) {
                console.log("  search  time budget reached, stopping early")
                exhausted = true
                break
            }

            const a = queue[head++]
            queued[a] = 0
            if (head > 1 << 16 && head * 2 > queue.length) {
                queue.splice(0, head)
                head = 0
            }

            let improved = false
            for (let direction = 0; direction < 2 && !improved; direction++) {
                const b =
                    direction === 0
                        ? tour[(position[a] + 1) % count]
                        : tour[(position[a] - 1 + count) % count]
                const removed = distance(a, b)

                for (let slot = 0; slot < k; slot++) {
                    const c = neighbours[a * k + slot]
                    if (c < 0) break
                    const added = distance(a, c)
                    if (added >= removed) break

                    const d =
                        direction === 0
                            ? tour[(position[c] + 1) % count]
                            : tour[(position[c] - 1 + count) % count]
                    if (d === a || c === b) continue

                    const gain =
                        removed + distance(c, d) - added - distance(b, d)
                    if (gain <= 1e-9) continue

                    if (direction === 0) reverse(position[b], position[c])
                    else reverse(position[a], position[d])

                    push(a)
                    push(b)
                    push(c)
                    push(d)
                    moves++
                    improved = true
                    break
                }
            }

            if (!improved && tryOrOpt(a)) moves++
        }

        sweep++
        if (moves === before) exhausted = true
    }

    console.log(
        `  search  ${moves.toLocaleString(
            "en-GB",
        )} improving moves over ${sweep} sweeps`,
    )
}

// A closed tour becomes a single open stroke by dropping its longest edge, which is
// the join the eye would notice most.
const openAtLongestEdge = (
    xs: Float64Array,
    ys: Float64Array,
    tour: Int32Array,
): Int32Array => {
    let worst = 0
    let worstIndex = 0
    for (let i = 0; i < tour.length; i++) {
        const a = tour[i]
        const b = tour[(i + 1) % tour.length]
        const length = Math.hypot(xs[a] - xs[b], ys[a] - ys[b])
        if (length > worst) {
            worst = length
            worstIndex = i
        }
    }

    const opened = new Int32Array(tour.length)
    for (let i = 0; i < tour.length; i++) {
        opened[i] = tour[(worstIndex + 1 + i) % tour.length]
    }
    return opened
}

const handler = async () => {
    const args = parseArgs(process.argv.slice(2))
    const options = readCommonOptions(args, "01-stipple-tsp", {
        gamma: 1.15,
        minInk: 0.18,
        maxInk: 0.92,
    })
    const pointCount = Math.round(readNumber(args, "points", 15000))
    const edgeWeight = readNumber(args, "edges", 0.35)
    const relaxations = Math.round(readNumber(args, "relax", 24))
    const k = Math.round(readNumber(args, "neighbours", 8))
    const budgetSeconds = readNumber(args, "seconds", 45)
    const cullThreshold = readNumber(args, "cull", 0.05)
    const seedOrder = readString(args, "seed-order", "greedy")
    const closed = readFlag(args, "closed", false)

    describeRun("Option 1 — stipple + travelling salesman path", options)

    const ink = await loadInkMap(options.input, options)
    const importance = combineFields(ink, gradientMagnitude(ink), edgeWeight)
    const cumulative = buildCumulative(importance)
    const random = createRandom(options.seed)

    console.log(
        `  scatter ${pointCount.toLocaleString("en-GB")} points across ${
            ink.width
        } x ${ink.height} px of tone`,
    )
    const scattered = scatterPoints(importance, cumulative, pointCount, random)
    relax(
        scattered.xs,
        scattered.ys,
        importance,
        cumulative,
        relaxations,
        random,
    )

    const { xs, ys } = cullFaintPoints(
        scattered.xs,
        scattered.ys,
        importance,
        cullThreshold,
    )
    if (xs.length < pointCount) {
        console.log(
            `  cull    dropped ${pointCount - xs.length} points sitting on bare paper`,
        )
    }

    let tour =
        seedOrder === "greedy"
            ? nearestNeighbourTour(xs, ys, ink.width, ink.height)
            : hilbertTour(xs, ys, ink.width, ink.height)
    const seedLength = tourLength(xs, ys, tour)
    console.log(
        `  seed    ${seedOrder} tour length ${Math.round(seedLength)} px`,
    )

    const grid = buildGrid(xs, ys, xs.length, ink.width, ink.height)
    const neighbours = nearestNeighbourLists(grid, k)
    improveTour(xs, ys, tour, neighbours, k, budgetSeconds)
    const improvedLength = tourLength(xs, ys, tour)
    console.log(
        `  refined tour length ${Math.round(improvedLength)} px (${(
            (1 - improvedLength / seedLength) *
            100
        ).toFixed(1)}% shorter)`,
    )

    if (!closed) tour = openAtLongestEdge(xs, ys, tour)

    const page = createPage(
        ink.width,
        ink.height,
        options.pageWidthMm,
        options.marginMm,
    )
    const points: Point[] = []
    for (let i = 0; i < tour.length; i++) {
        points.push(toPage(page, xs[tour[i]], ys[tour[i]]))
    }

    reportPath(points, closed)

    await writeOutputs({
        basePath: options.output,
        svg: renderSvg({
            points,
            closed,
            page,
            strokeWidthMm: options.strokeWidthMm,
            smooth: options.smooth,
            title: "Stipple travelling salesman portrait",
        }),
        page,
        previewWidth: options.previewWidth,
    })
}

handler()
