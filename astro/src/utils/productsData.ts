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
    "print_nebula-1_50x70": nebulaShared,
    "print_nebula-2_50x70": nebulaShared,
    "print_nebula-3_50x70": nebulaShared,
}

export default productsData
