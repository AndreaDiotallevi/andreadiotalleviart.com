import p5 from "p5"
import { getDefaultControlsForSketch, loadSketchModule } from "../sketches/registry"
import { mergeSketchControls, type SketchControls } from "../sketches/types"

type CleanupFn = () => void

type SketchesWindow = Window & {
    __sketchesPageBootstrapped?: boolean
    __sketchesPageCleanup?: CleanupFn
}

const ROOT_SELECTOR = "[data-sketch-page-root]"
const SKETCH_QUERY_KEYS = ["reverse", "noiseSeed"]

const parseBoolean = (value: string | null, fallback: boolean): boolean => {
    if (value === null) return fallback
    const normalisedValue = value.trim().toLowerCase()

    if (normalisedValue === "1" || normalisedValue === "true" || normalisedValue === "yes") {
        return true
    }

    if (normalisedValue === "0" || normalisedValue === "false" || normalisedValue === "no") {
        return false
    }

    return fallback
}

const parseNoiseSeed = (value: string | null, fallback: number): number => {
    if (value === null) return fallback

    const parsedSeed = Number.parseInt(value, 10)
    return Number.isNaN(parsedSeed) ? fallback : parsedSeed
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
    searchParams.set("reverse", controls.reverse ? "1" : "0")
    searchParams.set("noiseSeed", `${controls.noiseSeed}`)

    const nextUrl = `${window.location.pathname}?${searchParams.toString()}${window.location.hash}`
    window.history.replaceState(window.history.state, "", nextUrl)
}

const initialiseMobileMenu = (root: HTMLElement): CleanupFn => {
    const menuPanel = root.querySelector<HTMLElement>("[data-sketch-menu-panel]")
    const menuToggle = root.querySelector<HTMLButtonElement>("[data-sketch-menu-toggle]")
    const menuClose = root.querySelector<HTMLButtonElement>("[data-sketch-menu-close]")
    const menuLinks = root.querySelectorAll<HTMLAnchorElement>("[data-sketch-menu-link]")

    if (!menuPanel || !menuToggle || !menuClose) return () => {}

    const closeMenu = () => {
        menuPanel.classList.add("hidden")
        document.body.style.overflow = ""
    }

    const openMenu = () => {
        menuPanel.classList.remove("hidden")
        document.body.style.overflow = "hidden"
    }

    menuToggle.addEventListener("click", openMenu)
    menuClose.addEventListener("click", closeMenu)
    menuLinks.forEach(link => link.addEventListener("click", closeMenu))

    return () => {
        closeMenu()
        menuToggle.removeEventListener("click", openMenu)
        menuClose.removeEventListener("click", closeMenu)
        menuLinks.forEach(link => link.removeEventListener("click", closeMenu))
    }
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
    const reverseInput = root.querySelector<HTMLInputElement>("[data-control-reverse]")
    const noiseSeedInput = root.querySelector<HTMLInputElement>("[data-control-noise-seed]")
    const randomSeedButton = root.querySelector<HTMLButtonElement>("[data-control-random-seed]")
    const resetButton = root.querySelector<HTMLButtonElement>("[data-control-reset]")

    if (!canvasContainer || !reverseInput || !noiseSeedInput || !randomSeedButton || !resetButton) {
        return
    }

    const defaultControls = getDefaultControlsForSketch(sketchSlug)
    const searchParams = new URLSearchParams(window.location.search)

    let controls = hasControlParams(searchParams)
        ? mergeSketchControls(
              {
                  reverse: parseBoolean(searchParams.get("reverse"), defaultControls.reverse),
                  noiseSeed: parseNoiseSeed(searchParams.get("noiseSeed"), defaultControls.noiseSeed),
              },
              defaultControls,
          )
        : defaultControls

    reverseInput.checked = controls.reverse
    noiseSeedInput.value = `${controls.noiseSeed}`
    if (errorMessage) errorMessage.classList.add("hidden")

    let sketchInstance: p5 | null = null
    let disposed = false
    const cleanupFunctions: CleanupFn[] = []

    const syncControlsFromInputs = () => {
        controls = mergeSketchControls(
            {
                reverse: reverseInput.checked,
                noiseSeed: parseNoiseSeed(noiseSeedInput.value, controls.noiseSeed),
            },
            defaultControls,
        )

        reverseInput.checked = controls.reverse
        noiseSeedInput.value = `${controls.noiseSeed}`
    }

    const handleReverseChange = () => {
        syncControlsFromInputs()
        writeControlsToUrl(controls)
    }

    const handleNoiseSeedChange = () => {
        syncControlsFromInputs()
        writeControlsToUrl(controls)
    }

    const handleRandomSeed = () => {
        const randomSeed = Math.floor(Math.random() * 1_000_000)
        controls = mergeSketchControls({ reverse: reverseInput.checked, noiseSeed: randomSeed }, defaultControls)
        reverseInput.checked = controls.reverse
        noiseSeedInput.value = `${controls.noiseSeed}`
        writeControlsToUrl(controls)
    }

    const handleReset = () => {
        controls = defaultControls
        reverseInput.checked = controls.reverse
        noiseSeedInput.value = `${controls.noiseSeed}`
        removeControlParamsFromUrl()
    }

    reverseInput.addEventListener("change", handleReverseChange)
    noiseSeedInput.addEventListener("change", handleNoiseSeedChange)
    randomSeedButton.addEventListener("click", handleRandomSeed)
    resetButton.addEventListener("click", handleReset)

    cleanupFunctions.push(() => reverseInput.removeEventListener("change", handleReverseChange))
    cleanupFunctions.push(() => noiseSeedInput.removeEventListener("change", handleNoiseSeedChange))
    cleanupFunctions.push(() => randomSeedButton.removeEventListener("click", handleRandomSeed))
    cleanupFunctions.push(() => resetButton.removeEventListener("click", handleReset))
    cleanupFunctions.push(initialiseMobileMenu(root))

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
