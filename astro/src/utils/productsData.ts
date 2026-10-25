export type ProductExtraData = {
    about: string[]
    framing: string[]
}

const nebulaShared: ProductExtraData = {
    about: [
        "This piece is built from overlapping circles that grow larger as they layer, creating depth and movement. A gently warming background ties the trilogy together as it progresses.",
        "Where the circles overlap, the colours blend in soft, unexpected ways — with a quiet sense of motion that holds up even when you look closely.",
        "I originally made it for a dear friend, Alessandro, who wanted bold, saturated colours to bring life into a darker living room. It's a good fit if you're looking to brighten a space.",
    ],
    framing: [
        "I'd recommend a simple white frame (50 × 70 cm), no wider than about 20 mm. The print fits directly into the frame — no mount needed — so the artwork stays the focus.",
        "If you're getting this piece on its own (not as part of the trilogy), you can add a 5 cm mount and use a larger 60 × 80 cm frame for a bit more breathing room.",
    ],
}

export const productsData: Record<string, ProductExtraData> = {
    "print_flames_A3": {
        about: [
            "This piece starts from a source image. I use a pixel-sorting algorithm that reorders the pixels by colour, pulling them into flowing ribbons.",
            "The result is a soft, rich texture — edges dissolve into gradients, with a depth that feels somehow both natural and made by code.",
        ],
        framing: [],
        // framing: [
        //     "A simple white A3 frame (297 x 420 mm) with a slim profile (≤ 20 mm) is recommended. The print is full bleed with no border, so it sits cleanly edge-to-edge.",
        //     "If you prefer a mounted look, use a 40 x 50 cm frame with a 3-5 cm mount opening cut to A3 — this adds breathing room while keeping the piece bold and elegant.",
        // ],
    },
    "print_nebula-1_50x70": {
        about: [
            "The first piece of the Nebula trilogy. Here the nebula is just beginning to form — the circles are still small, and you can see the overall shape starting to emerge.",
            "The background is a soft, light yellow, which gives the piece an airy, open feel.",
            "Where the circles overlap, the colours blend gently, with a quiet sense of motion that holds up even close up.",
        ],
        framing: nebulaShared.framing,
    },
    "print_nebula-2_50x70": {
        about: [
            "The second piece of the Nebula trilogy. The same circular forms from Nebula I are now exactly double the size, and take up more of the composition.",
            "Circles gather to suggest a larger sphere, with others clustering around it.",
            "The background shifts a little darker toward orange — warm and balanced.",
            "Overlapping circles keep creating unexpected colour blends and a quiet sense of motion.",
        ],
        framing: nebulaShared.framing,
    },
    "print_nebula-3_50x70": {
        about: [
            "The third and final piece of the Nebula trilogy. The circles are exactly double the size of Nebula II (four times Nebula I).",
            "Most of them extend beyond the frame, so the image feels quite different from the earlier pieces.",
            "The background deepens to a dark orange-red, with stronger contrast against the circle colours.",
            "As throughout the trilogy, the overlapping circles create unexpected colour blends.",
        ],
        framing: nebulaShared.framing,
    },
}

export default productsData
