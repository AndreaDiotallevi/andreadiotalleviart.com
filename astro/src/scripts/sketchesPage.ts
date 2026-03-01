import p5 from "p5"
import { loadSketchModule } from "../sketches/registry"
import { DEFAULT_SKETCH_CONTROLS, mergeSketchControls, type SketchControls } from "../sketches/types"

type CleanupFn = () => void

type SketchesWindow = Window & {
    __sketchesPageBootstrapped?: boolean
    __sketchesPageCleanup?: CleanupFn
}

const ROOT_SELECTOR = "[data-sketch-page-root]"
const SKETCH_QUERY_KEYS = ["noiseSeed", "randomSeed"]

const parseSeed = (value: string | null, fallback: number): number => {
    if (value === null) return fallback
    const parsed = Number.parseInt(value, 10)
    return Number.isNaN(parsed) ? fallback : parsed
}

const hasControlParams = (searchParams: URLSearchParams): boolean =>
    SKETCH_QUERY_KEYS.some(key => searchParams.has(key))

const removeControlParamsFromUrl = () => {
    const searchParams = new URLSearchParams(window.location.search)
    let urlChanged = false

    for (const key of SKETCH_QUERY_KEYS) {
        if (!searchParams.has(key)) continue
        searchParams.delete(key)
        urlChanged = true
    }

    if (!urlChanged) return

    const nextQuery = searchParams.toString()
    const nextUrl = nextQuery
        ? `${window.location.pathname}?${nextQuery}${window.location.hash}`
        : `${window.location.pathname}${window.location.hash}`

    window.history.replaceState(window.history.state, "", nextUrl)
}

const writeControlsToUrl = (controls: SketchControls) => {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set("noiseSeed", `${controls.noiseSeed}`)
    searchParams.set("randomSeed", `${controls.randomSeed}`)

    const nextUrl = `${window.location.pathname}?${searchParams.toString()}${window.location.hash}`
    window.history.replaceState(window.history.state, "", nextUrl)
}

const initialiseSketchPage = async (): Promise<void> => {
    const runtimeWindow = window as SketchesWindow

    if (runtimeWindow.__sketchesPageCleanup) {
        runtimeWindow.__sketchesPageCleanup()
        runtimeWindow.__sketchesPageCleanup = undefined
    }

    const root = document.querySelector<HTMLElement>(ROOT_SELECTOR)
    if (!root) return

    const sketchSlug = root.dataset.sketchSlug
    if (!sketchSlug) return

    const canvasContainer = root.querySelector<HTMLElement>("[data-sketch-canvas]")
    const errorMessage = root.querySelector<HTMLElement>("[data-sketch-error]")
    const noiseSeedInput = root.querySelector<HTMLInputElement>("[data-control-noise-seed]")
    const randomSeedInput = root.querySelector<HTMLInputElement>("[data-control-random-seed]")
    const randomizeButton = root.querySelector<HTMLButtonElement>("[data-control-randomize-seeds]")
    const resetButton = root.querySelector<HTMLButtonElement>("[data-control-reset]")
    const saveImageButton = root.querySelector<HTMLButtonElement>("[data-control-save-image]")

    if (!canvasContainer || !noiseSeedInput || !randomSeedInput || !randomizeButton || !resetButton || !saveImageButton) {
        return
    }

    const defaultControls: SketchControls = mergeSketchControls(
        {
            noiseSeed: parseSeed(root.dataset.defaultNoiseSeed ?? null, DEFAULT_SKETCH_CONTROLS.noiseSeed),
            randomSeed: parseSeed(root.dataset.defaultRandomSeed ?? null, DEFAULT_SKETCH_CONTROLS.randomSeed),
        },
        DEFAULT_SKETCH_CONTROLS,
    )
    const searchParams = new URLSearchParams(window.location.search)

    let controls = hasControlParams(searchParams)
        ? mergeSketchControls(
              {
                  noiseSeed: parseSeed(searchParams.get("noiseSeed"), defaultControls.noiseSeed),
                  randomSeed: parseSeed(searchParams.get("randomSeed"), defaultControls.randomSeed),
              },
              defaultControls,
          )
        : defaultControls

    noiseSeedInput.value = `${controls.noiseSeed}`
    randomSeedInput.value = `${controls.randomSeed}`
    if (errorMessage) errorMessage.classList.add("hidden")

    let sketchInstance: p5 | null = null
    let disposed = false
    const cleanupFunctions: CleanupFn[] = []

    const syncControlsFromInputs = () => {
        controls = mergeSketchControls(
            {
                noiseSeed: parseSeed(noiseSeedInput.value, controls.noiseSeed),
                randomSeed: parseSeed(randomSeedInput.value, controls.randomSeed),
            },
            defaultControls,
        )

        noiseSeedInput.value = `${controls.noiseSeed}`
        randomSeedInput.value = `${controls.randomSeed}`
    }

    const handleNoiseSeedChange = () => {
        syncControlsFromInputs()
        writeControlsToUrl(controls)
    }

    const handleRandomSeedChange = () => {
        syncControlsFromInputs()
        writeControlsToUrl(controls)
    }

    const handleRandomizeSeeds = () => {
        controls = mergeSketchControls(
            {
                noiseSeed: Math.floor(Math.random() * 1_000_000),
                randomSeed: Math.floor(Math.random() * 1_000_000),
            },
            defaultControls,
        )
        noiseSeedInput.value = `${controls.noiseSeed}`
        randomSeedInput.value = `${controls.randomSeed}`
        writeControlsToUrl(controls)
    }

    const handleReset = () => {
        controls = defaultControls
        noiseSeedInput.value = `${controls.noiseSeed}`
        randomSeedInput.value = `${controls.randomSeed}`
        removeControlParamsFromUrl()
    }

    const handleSaveImage = () => {
        if (sketchInstance) {
            sketchInstance.saveCanvas(sketchSlug, "png")
        }
    }

    noiseSeedInput.addEventListener("change", handleNoiseSeedChange)
    randomSeedInput.addEventListener("change", handleRandomSeedChange)
    randomizeButton.addEventListener("click", handleRandomizeSeeds)
    resetButton.addEventListener("click", handleReset)
    saveImageButton.addEventListener("click", handleSaveImage)

    cleanupFunctions.push(() => noiseSeedInput.removeEventListener("change", handleNoiseSeedChange))
    cleanupFunctions.push(() => randomSeedInput.removeEventListener("change", handleRandomSeedChange))
    cleanupFunctions.push(() => randomizeButton.removeEventListener("click", handleRandomizeSeeds))
    cleanupFunctions.push(() => resetButton.removeEventListener("click", handleReset))
    cleanupFunctions.push(() => saveImageButton.removeEventListener("click", handleSaveImage))

    runtimeWindow.__sketchesPageCleanup = () => {
        if (disposed) return
        disposed = true

        cleanupFunctions.forEach(cleanup => cleanup())
        cleanupFunctions.length = 0

        if (sketchInstance) {
            sketchInstance.remove()
            sketchInstance = null
        }
    }

    try {
        const sketchModule = await loadSketchModule(sketchSlug)
        if (disposed) return

        if (!sketchModule) {
            if (errorMessage) {
                errorMessage.textContent = "Unable to load this sketch."
                errorMessage.classList.remove("hidden")
            }
            return
        }

        sketchInstance = new p5((instance) => sketchModule.default(instance, () => controls), canvasContainer)
    } catch (error) {
        if (disposed) return

        if (errorMessage) {
            errorMessage.textContent = "Unable to load this sketch."
            errorMessage.classList.remove("hidden")
        }
    }
}

export const bootSketchesPage = () => {
    const runtimeWindow = window as SketchesWindow

    if (runtimeWindow.__sketchesPageBootstrapped) {
        void initialiseSketchPage()
        return
    }

    runtimeWindow.__sketchesPageBootstrapped = true
    document.addEventListener("astro:before-swap", () => {
        if (!runtimeWindow.__sketchesPageCleanup) return
        runtimeWindow.__sketchesPageCleanup()
        runtimeWindow.__sketchesPageCleanup = undefined
    })
    document.addEventListener("astro:page-load", () => {
        void initialiseSketchPage()
    })

    void initialiseSketchPage()
}
