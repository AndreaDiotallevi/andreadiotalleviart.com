import sharp from "sharp"

export type Field = {
    width: number
    height: number
    values: Float32Array
}

export type ToneOptions = {
    resolution: number
    gamma: number
    minInk: number
    maxInk: number
    blur: number
    invert: boolean
}

// Ink coverage rather than brightness: 0 leaves the paper bare, 1 is solid black.
export const loadInkMap = async (
    imagePath: string,
    options: ToneOptions,
): Promise<Field> => {
    let pipeline = sharp(imagePath)
        .flatten({ background: "#ffffff" })
        .resize({ width: Math.round(options.resolution) })
        .grayscale()

    if (options.blur > 0) pipeline = pipeline.blur(options.blur)

    const { data, info } = await pipeline
        .raw()
        .toBuffer({ resolveWithObject: true })

    const { width, height, channels } = info
    const values = new Float32Array(width * height)
    const span = Math.max(1e-6, options.maxInk - options.minInk)

    for (let i = 0; i < values.length; i++) {
        const grey = data[i * channels] / 255
        const darkness = options.invert ? grey : 1 - grey
        const levelled = (darkness - options.minInk) / span
        values[i] = Math.pow(clamp01(levelled), options.gamma)
    }

    return { width, height, values }
}

export const clamp01 = (value: number): number =>
    value < 0 ? 0 : value > 1 ? 1 : value

// Sobel gradient magnitude, normalised to 0..1. Peaks on eyes, nostrils, lips, hairline.
export const gradientMagnitude = (field: Field): Field => {
    const { width, height, values } = field
    const out = new Float32Array(width * height)
    let peak = 1e-6

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const i = y * width + x
            const tl = values[i - width - 1]
            const tc = values[i - width]
            const tr = values[i - width + 1]
            const ml = values[i - 1]
            const mr = values[i + 1]
            const bl = values[i + width - 1]
            const bc = values[i + width]
            const br = values[i + width + 1]

            const gx = tr + 2 * mr + br - (tl + 2 * ml + bl)
            const gy = bl + 2 * bc + br - (tl + 2 * tc + tr)
            const magnitude = Math.sqrt(gx * gx + gy * gy)

            out[i] = magnitude
            if (magnitude > peak) peak = magnitude
        }
    }

    for (let i = 0; i < out.length; i++) out[i] /= peak

    return { width, height, values: out }
}

// Sobel gradient as vectors. The perpendicular of the gradient is the direction a
// pen should travel to follow a feature instead of crossing it.
export const gradientVectors = (field: Field): { x: Field; y: Field } => {
    const { width, height, values } = field
    const gxs = new Float32Array(width * height)
    const gys = new Float32Array(width * height)

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const i = y * width + x
            const tl = values[i - width - 1]
            const tc = values[i - width]
            const tr = values[i - width + 1]
            const ml = values[i - 1]
            const mr = values[i + 1]
            const bl = values[i + width - 1]
            const bc = values[i + width]
            const br = values[i + width + 1]

            gxs[i] = (tr + 2 * mr + br - (tl + 2 * ml + bl)) / 8
            gys[i] = (bl + 2 * bc + br - (tl + 2 * tc + tr)) / 8
        }
    }

    return {
        x: { width, height, values: gxs },
        y: { width, height, values: gys },
    }
}

// Separable box blur, repeated to approximate a gaussian.
export const blurField = (field: Field, radius: number, passes = 2): Field => {
    const { width, height } = field
    let source = Float32Array.from(field.values)
    if (radius < 1) return { width, height, values: source }

    let target = new Float32Array(source.length)
    const window = radius * 2 + 1

    for (let pass = 0; pass < passes; pass++) {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let total = 0
                for (let k = -radius; k <= radius; k++) {
                    total += source[y * width + clampInt(x + k, 0, width - 1)]
                }
                target[y * width + x] = total / window
            }
        }
        const swap = source
        source = target
        target = swap

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let total = 0
                for (let k = -radius; k <= radius; k++) {
                    total += source[clampInt(y + k, 0, height - 1) * width + x]
                }
                target[y * width + x] = total / window
            }
        }
        const swapAgain = source
        source = target
        target = swapAgain
    }

    return { width, height, values: source }
}

export const combineFields = (
    base: Field,
    detail: Field,
    detailWeight: number,
): Field => {
    const values = new Float32Array(base.values.length)
    for (let i = 0; i < values.length; i++) {
        values[i] = clamp01(
            base.values[i] * (1 - detailWeight) +
                detail.values[i] * detailWeight,
        )
    }
    return { width: base.width, height: base.height, values }
}

export const sampleField = (field: Field, x: number, y: number): number => {
    const { width, height, values } = field
    if (x < 0 || y < 0 || x > width - 1 || y > height - 1) return 0

    const x0 = Math.floor(x)
    const y0 = Math.floor(y)
    const x1 = Math.min(width - 1, x0 + 1)
    const y1 = Math.min(height - 1, y0 + 1)
    const fx = x - x0
    const fy = y - y0

    const top =
        values[y0 * width + x0] * (1 - fx) + values[y0 * width + x1] * fx
    const bottom =
        values[y1 * width + x0] * (1 - fx) + values[y1 * width + x1] * fx

    return top * (1 - fy) + bottom * fy
}

// Summed area table for constant time rectangle averages.
export const buildIntegral = (field: Field): Float64Array => {
    const { width, height, values } = field
    const stride = width + 1
    const integral = new Float64Array(stride * (height + 1))

    for (let y = 0; y < height; y++) {
        let rowTotal = 0
        for (let x = 0; x < width; x++) {
            rowTotal += values[y * width + x]
            integral[(y + 1) * stride + (x + 1)] =
                integral[y * stride + (x + 1)] + rowTotal
        }
    }

    return integral
}

export const rectangleAverage = (
    integral: Float64Array,
    field: Field,
    left: number,
    top: number,
    right: number,
    bottom: number,
): number => {
    const stride = field.width + 1
    const x0 = clampInt(Math.floor(left), 0, field.width)
    const y0 = clampInt(Math.floor(top), 0, field.height)
    const x1 = clampInt(Math.ceil(right), x0 + 1, field.width)
    const y1 = clampInt(Math.ceil(bottom), y0 + 1, field.height)

    const total =
        integral[y1 * stride + x1] -
        integral[y0 * stride + x1] -
        integral[y1 * stride + x0] +
        integral[y0 * stride + x0]

    return total / ((x1 - x0) * (y1 - y0))
}

export const clampInt = (value: number, min: number, max: number): number =>
    value < min ? min : value > max ? max : value
