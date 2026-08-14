// Uniform bucket grid. Every nearest neighbour query in these sketches goes through
// here, which is what keeps the point based algorithms out of quadratic territory.

export type Grid = {
    cols: number
    rows: number
    cellSize: number
    starts: Int32Array
    items: Int32Array
    xs: Float64Array
    ys: Float64Array
    count: number
}

const cellIndex = (grid: Grid, x: number, y: number): number => {
    const cx = Math.min(
        grid.cols - 1,
        Math.max(0, Math.floor(x / grid.cellSize)),
    )
    const cy = Math.min(
        grid.rows - 1,
        Math.max(0, Math.floor(y / grid.cellSize)),
    )
    return cy * grid.cols + cx
}

export const buildGrid = (
    xs: Float64Array,
    ys: Float64Array,
    count: number,
    width: number,
    height: number,
    pointsPerCell = 2,
): Grid => {
    const cellSize = Math.max(
        1e-6,
        Math.sqrt((width * height * pointsPerCell) / Math.max(1, count)),
    )
    const cols = Math.max(1, Math.ceil(width / cellSize))
    const rows = Math.max(1, Math.ceil(height / cellSize))

    const grid: Grid = {
        cols,
        rows,
        cellSize,
        starts: new Int32Array(cols * rows + 1),
        items: new Int32Array(count),
        xs,
        ys,
        count,
    }

    const counts = new Int32Array(cols * rows)
    for (let i = 0; i < count; i++) counts[cellIndex(grid, xs[i], ys[i])]++

    let running = 0
    for (let c = 0; c < counts.length; c++) {
        grid.starts[c] = running
        running += counts[c]
    }
    grid.starts[counts.length] = running

    const cursor = Int32Array.from(grid.starts.subarray(0, counts.length))
    for (let i = 0; i < count; i++) {
        const c = cellIndex(grid, xs[i], ys[i])
        grid.items[cursor[c]++] = i
    }

    return grid
}

// Expanding ring search. Stops as soon as the unexplored ring cannot beat the
// current best, which is the usual conservative bound of (ring - 1) * cellSize.
export const nearest = (
    grid: Grid,
    x: number,
    y: number,
    exclude = -1,
): number => {
    const cx = Math.min(
        grid.cols - 1,
        Math.max(0, Math.floor(x / grid.cellSize)),
    )
    const cy = Math.min(
        grid.rows - 1,
        Math.max(0, Math.floor(y / grid.cellSize)),
    )
    const maxRing = Math.max(grid.cols, grid.rows)

    let best = -1
    let bestDistance = Infinity

    for (let ring = 0; ring <= maxRing; ring++) {
        if (best >= 0) {
            const safe = (ring - 1) * grid.cellSize
            if (safe > 0 && bestDistance <= safe * safe) break
        }

        for (let dy = -ring; dy <= ring; dy++) {
            const gy = cy + dy
            if (gy < 0 || gy >= grid.rows) continue
            const edgeRow = dy === -ring || dy === ring

            for (let dx = -ring; dx <= ring; dx++) {
                if (!edgeRow && dx !== -ring && dx !== ring) continue
                const gx = cx + dx
                if (gx < 0 || gx >= grid.cols) continue

                const cell = gy * grid.cols + gx
                for (
                    let s = grid.starts[cell];
                    s < grid.starts[cell + 1];
                    s++
                ) {
                    const index = grid.items[s]
                    if (index === exclude) continue
                    const ddx = grid.xs[index] - x
                    const ddy = grid.ys[index] - y
                    const distance = ddx * ddx + ddy * ddy
                    if (distance < bestDistance) {
                        bestDistance = distance
                        best = index
                    }
                }
            }
        }
    }

    return best
}

// Candidate lists for 2-opt: the k closest points to every point, nearest first.
export const nearestNeighbourLists = (grid: Grid, k: number): Int32Array => {
    const { count, xs, ys } = grid
    const lists = new Int32Array(count * k).fill(-1)
    const candidateIndex = new Int32Array(k)
    const candidateDistance = new Float64Array(k)

    for (let i = 0; i < count; i++) {
        let found = 0
        let worst = Infinity

        const cx = Math.min(
            grid.cols - 1,
            Math.max(0, Math.floor(xs[i] / grid.cellSize)),
        )
        const cy = Math.min(
            grid.rows - 1,
            Math.max(0, Math.floor(ys[i] / grid.cellSize)),
        )
        const maxRing = Math.max(grid.cols, grid.rows)

        for (let ring = 0; ring <= maxRing; ring++) {
            if (found === k) {
                const safe = (ring - 1) * grid.cellSize
                if (safe > 0 && worst <= safe * safe) break
            }

            for (let dy = -ring; dy <= ring; dy++) {
                const gy = cy + dy
                if (gy < 0 || gy >= grid.rows) continue
                const edgeRow = dy === -ring || dy === ring

                for (let dx = -ring; dx <= ring; dx++) {
                    if (!edgeRow && dx !== -ring && dx !== ring) continue
                    const gx = cx + dx
                    if (gx < 0 || gx >= grid.cols) continue

                    const cell = gy * grid.cols + gx
                    for (
                        let s = grid.starts[cell];
                        s < grid.starts[cell + 1];
                        s++
                    ) {
                        const j = grid.items[s]
                        if (j === i) continue

                        const ddx = xs[j] - xs[i]
                        const ddy = ys[j] - ys[i]
                        const distance = ddx * ddx + ddy * ddy
                        if (found === k && distance >= worst) continue

                        let slot = found < k ? found++ : k - 1
                        while (
                            slot > 0 &&
                            candidateDistance[slot - 1] > distance
                        ) {
                            candidateDistance[slot] =
                                candidateDistance[slot - 1]
                            candidateIndex[slot] = candidateIndex[slot - 1]
                            slot--
                        }
                        candidateDistance[slot] = distance
                        candidateIndex[slot] = j
                        worst =
                            found === k ? candidateDistance[k - 1] : Infinity
                    }
                }
            }
        }

        for (let slot = 0; slot < k; slot++) {
            lists[i * k + slot] = slot < found ? candidateIndex[slot] : -1
        }
    }

    return lists
}

// Same grid, but points can be consumed. Used by the nearest neighbour tour, where
// every point must be visited exactly once.
export type ConsumableGrid = {
    grid: Grid
    ends: Int32Array
    slots: Int32Array
    cells: Int32Array
}

export const buildConsumableGrid = (
    xs: Float64Array,
    ys: Float64Array,
    count: number,
    width: number,
    height: number,
    pointsPerCell = 2,
): ConsumableGrid => {
    const grid = buildGrid(xs, ys, count, width, height, pointsPerCell)
    const cellCount = grid.cols * grid.rows
    const ends = Int32Array.from(grid.starts.subarray(1, cellCount + 1))
    const slots = new Int32Array(count)
    const cells = new Int32Array(count)

    for (let cell = 0; cell < cellCount; cell++) {
        for (let s = grid.starts[cell]; s < grid.starts[cell + 1]; s++) {
            const index = grid.items[s]
            slots[index] = s
            cells[index] = cell
        }
    }

    return { grid, ends, slots, cells }
}

export const consume = (consumable: ConsumableGrid, index: number): void => {
    const { grid, ends, slots, cells } = consumable
    const cell = cells[index]
    const slot = slots[index]
    const last = ends[cell] - 1

    const moved = grid.items[last]
    grid.items[slot] = moved
    slots[moved] = slot
    grid.items[last] = index
    slots[index] = last
    ends[cell] = last
}

export const nearestRemaining = (
    consumable: ConsumableGrid,
    x: number,
    y: number,
): number => {
    const { grid, ends } = consumable
    const cx = Math.min(
        grid.cols - 1,
        Math.max(0, Math.floor(x / grid.cellSize)),
    )
    const cy = Math.min(
        grid.rows - 1,
        Math.max(0, Math.floor(y / grid.cellSize)),
    )
    const maxRing = Math.max(grid.cols, grid.rows)

    let best = -1
    let bestDistance = Infinity

    for (let ring = 0; ring <= maxRing; ring++) {
        if (best >= 0) {
            const safe = (ring - 1) * grid.cellSize
            if (safe > 0 && bestDistance <= safe * safe) break
        }

        for (let dy = -ring; dy <= ring; dy++) {
            const gy = cy + dy
            if (gy < 0 || gy >= grid.rows) continue
            const edgeRow = dy === -ring || dy === ring

            for (let dx = -ring; dx <= ring; dx++) {
                if (!edgeRow && dx !== -ring && dx !== ring) continue
                const gx = cx + dx
                if (gx < 0 || gx >= grid.cols) continue

                const cell = gy * grid.cols + gx
                for (let s = grid.starts[cell]; s < ends[cell]; s++) {
                    const index = grid.items[s]
                    const ddx = grid.xs[index] - x
                    const ddy = grid.ys[index] - y
                    const distance = ddx * ddx + ddy * ddy
                    if (distance < bestDistance) {
                        bestDistance = distance
                        best = index
                    }
                }
            }
        }
    }

    return best
}
