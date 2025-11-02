export type ProductExtraData = {
    about: string[]
    framing: string[]
}

const nebulaShared: ProductExtraData = {
    about: [
        "This generative artwork is built from overlapping circles that grow in size, layered to create depth and movement. A gently warming background hue ties the series together as it progresses.",
        "The transparency of the circles creates nuanced colour blends and a sense of motion, preserving fine detail that feels alive from any viewing distance.",
        "Originally created for a dear friend, Alessandro, who wanted bold, saturated colours to bring life and energy into a darker living room — ideal if you're looking to brighten your space with vibrant, uplifting tones.",
    ],
    framing: [
        "A simple white frame (50 x 70 cm) with a frame width no wider than 20 mm is recommended. This clean style lets the artwork shine, with the print fitting directly into the frame — no extra mounting needed.",
        "If you're buying this artwork alone (not as part of the series), you can add a 5 cm mount and use a larger frame (60 x 80 cm) for a bold and elegant look.",
    ],
}

export const productsData: Record<string, ProductExtraData> = {
    "print_flames_A3": {
        about: [
            "This generative artwork is created using a pixel-sorting technique applied to a source image. The algorithm reorders pixels based on their hue, sweeping colour channels into flowing ribbons.",
            "This process produces a rich, soft texture where edges dissolve into gradients, revealing subtle transitions and a tactile depth that feels both organic and computational.",
        ],
        framing: [],
        // framing: [
        //     "A simple white A3 frame (297 x 420 mm) with a slim profile (≤ 20 mm) is recommended. The print is full bleed with no border, so it sits cleanly edge-to-edge.",
        //     "If you prefer a mounted look, use a 40 x 50 cm frame with a 3-5 cm mount opening cut to A3 — this adds breathing room while keeping the piece bold and elegant.",
        // ],
    },
    "print_nebula-1_50x70": {
        about: [
            "In this first artwork from the Nebula series, the nebula is at the origin of its formation. The circles are still small, and you can see the overall shape beginning to emerge.",
            "The background is a soft yellow and still quite light, giving the piece an airy, open feel.",
            "The transparency of the circles creates nuanced colour blends and a sense of motion, preserving fine detail that feels alive from any viewing distance.",
        ],
        framing: nebulaShared.framing,
    },
    "print_nebula-2_50x70": {
        about: [
            "This is the second and middle artwork in the series. The same circular forms from Nebula 1 are now exactly double the size, occupying more of the composition.",
            "Individual circles cluster to suggest a larger sphere, with surrounding circles gathering around it.",
            "The background shifts slightly darker toward orange, creating a warm, well-balanced feel.",
            "The transparency of the overlapping circles continues to generate unexpected colour blends and a sense of motion.",
        ],
        framing: nebulaShared.framing,
    },
    "print_nebula-3_50x70": {
        about: [
            "This is the third and final artwork in the series. The circles are exactly double the size of Nebula 2 (four times Nebula 1).",
            "Most circles extend beyond the frame, filling the composition so that the overall image feels markedly different from the previous pieces.",
            "The background deepens to a dark orange-red, adding strong character and striking contrast against the circle colours.",
            "The transparency of the overlapping circles generates unexpected colour blends — a signature effect across the series.",
        ],
        framing: nebulaShared.framing,
    },
}

export default productsData
