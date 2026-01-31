import type p5 from "p5"

// Pulled-out constants (defaults / config)
const DEFAULT_SCALE_START = 30
const DEFAULT_SCALE_END = 10
const DEFAULT_HUE_START = 35
const DEFAULT_HUE_END = 15
const DEFAULT_FRAMES = 600
const MIN_FRAMES = 2
const ratio1 = 2
const ratio2 = 1 / 675
const num = 1000
const randomSeed = 7302
const noiseSeed = randomSeed * 1000
const aspectRatio = 1.4
const DEFAULT_CANVAS_WIDTH = 600
const HSB_MAX_HUE = 360
const HSB_MAX_SAT = 100
const HSB_MAX_BRIGHT = 100
const ALPHA_OPAQUE = 1
const COLOR_ALPHA_GAUSSIAN_MEAN = 0.4
const COLOR_ALPHA_GAUSSIAN_SD = 0.25
const NOISE_STEP_DIVISOR = 36
const BG_GAUSSIAN_MEAN = 1

type Circle = { x: number; y: number; d: number }
type Shape = { color: ReturnType<p5["color"]>; count: number; circles: Circle[] }

export const DEFAULT_CANVAS_WIDTH_EXPORT = DEFAULT_CANVAS_WIDTH
export const ASPECT_RATIO_EXPORT = aspectRatio

export const sketch = (
    p5: p5,
    options: {
        scale?: number
        hue?: number
        scaleStart?: number
        scaleEnd?: number
        hueStart?: number
        hueEnd?: number
        frames?: number
        width?: number
    }
) => {
    const scaleStart = options.scaleStart ?? options.scale ?? DEFAULT_SCALE_START
    const scaleEnd = options.scaleEnd ?? options.scale ?? DEFAULT_SCALE_END
    const hueStart = options.hueStart ?? options.hue ?? DEFAULT_HUE_START
    const hueEnd = options.hueEnd ?? options.hue ?? DEFAULT_HUE_END
    const totalFrames = Math.max(MIN_FRAMES, options.frames ?? DEFAULT_FRAMES)

    const width = options.width || DEFAULT_CANVAS_WIDTH
    const height = width * aspectRatio

    let frameIndex = 0

    p5.setup = () => {
        p5.createCanvas(width, height)
        p5.colorMode("hsb", HSB_MAX_HUE, HSB_MAX_SAT, HSB_MAX_BRIGHT, ALPHA_OPAQUE)
        p5.noStroke()
    }

    const createCircles = (currentScale: number) => {
        const shapes: Shape[] = []

        for (let i = 1; i < num; i += i / 2 + 1) {
            const circles: Circle[] = []
            const color = p5.color(
                p5.random() * HSB_MAX_HUE,
                HSB_MAX_SAT,
                HSB_MAX_BRIGHT,
                p5.randomGaussian(COLOR_ALPHA_GAUSSIAN_MEAN, COLOR_ALPHA_GAUSSIAN_SD)
            )

            let count = 0
            for (let j = 0; j < 2 * p5.PI; j += p5.PI / (p5.noise(i) * NOISE_STEP_DIVISOR)) {
                const x = p5.cos(j) * p5.noise(i) * i * width * ratio1 * ratio2
                const y = p5.sin(j) * p5.noise(j) * i * width * ratio1 * ratio2
                const d = ((p5.randomGaussian(0) * width) / currentScale) * ratio1
                circles.push({ x, y, d })
                count++
            }
            shapes.push({ circles, color, count })
        }

        return shapes
    }

    const drawSketch = (currentHue: number, currentScale: number) => {
        let backgroundColor = p5.color(
            p5.random() * HSB_MAX_HUE,
            p5.randomGaussian(BG_GAUSSIAN_MEAN) * HSB_MAX_SAT,
            p5.randomGaussian(BG_GAUSSIAN_MEAN) * HSB_MAX_BRIGHT,
            ALPHA_OPAQUE
        )

        p5.background(backgroundColor)

        const shapes = createCircles(currentScale)

        p5.translate(width / 2, height / 2)
        backgroundColor = p5.color(currentHue, HSB_MAX_SAT, HSB_MAX_BRIGHT, ALPHA_OPAQUE)
        p5.background(backgroundColor)

        for (let i = 0; i < shapes.length; i++) {
            const group = shapes[i]
            p5.fill(group.color)
            for (let j = 0; j < group.circles.length; j++) {
                const circle = group.circles[j]
                p5.circle(circle.x, circle.y, circle.d)
            }
        }
    }

    p5.draw = () => {
        p5.randomSeed(randomSeed)
        p5.noiseSeed(noiseSeed)
        const t =
            totalFrames <= 1
                ? 1
                : Math.min(1, Math.max(0, frameIndex / (totalFrames - 1)))
        const currentScale = p5.lerp(scaleStart, scaleEnd, t)
        const currentHue = p5.lerp(hueStart, hueEnd, t)
        drawSketch(currentHue, currentScale)
        frameIndex++
        if (frameIndex >= totalFrames) {
            p5.noLoop()
        }
    }

    p5.mouseClicked = () => {
        frameIndex = 0
        if (!p5.isLooping()) {
            p5.loop()
        }
    }

    p5.touchStarted = () => {
        frameIndex = 0
        if (!p5.isLooping()) {
            p5.loop()
        }
    }
}
