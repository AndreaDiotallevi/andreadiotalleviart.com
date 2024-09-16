import { defineConfig } from "astro/config"
import { loadEnv } from "vite"

import partytown from "@astrojs/partytown"
import tailwind from "@astrojs/tailwind"

const { IMAGES_DOMAIN } = loadEnv(process.env.NODE_ENV, process.cwd(), "")
const imagesHostname = IMAGES_DOMAIN.replace(/^https?:\/\//, "")

// https://astro.build/config
export default defineConfig({
    site: "https://www.andreadiotalleviart.com",
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
        domains: ["https://files.stripe.com", imagesHostname],
    },
})
