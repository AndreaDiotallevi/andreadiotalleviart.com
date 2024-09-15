import { defineConfig } from "astro/config"

import partytown from "@astrojs/partytown"
import tailwind from "@astrojs/tailwind"

// https://astro.build/config
export default defineConfig({
    integrations: [
        tailwind(),
        partytown({
            config: {
                forward: ["dataLayer.push"],
            },
        }),
    ],
    output: "static",
    prefetch: {
        defaultStrategy: "viewport",
    },
    image: {
        domains: [
            "astro.build",
            "https://files.stripe.com",
            import.meta.env.IMAGES_DOMAIN,
        ],
    },
})
