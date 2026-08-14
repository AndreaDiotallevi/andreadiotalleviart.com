export type Random = () => number

// mulberry32: small, fast, seedable, so every sketch is reproducible from a seed
export const createRandom = (seed: number): Random => {
    let state = seed | 0 || 1
    return () => {
        state = (state + 0x6d2b79f5) | 0
        let t = state
        t = Math.imul(t ^ (t >>> 15), t | 1)
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}
