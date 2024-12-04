import { defineConfig } from "astro/config"
import { imageService } from "@unpic/astro/service"
import tailwind from "@astrojs/tailwind"
import netlify from "@astrojs/netlify"
import partytown from "@astrojs/partytown"

// https://astro.build/config
export default defineConfig({
    output: "hybrid",
    adapter: netlify(),
    trailingSlash: "never",
    build: { format: "file" },
    integrations: [
        tailwind(),
        partytown({
            config: {
                forward: ["dataLayer.push"],
            },
        }),
    ],
    experimental: { serverIslands: true },
    prefetch: { defaultStrategy: "load", prefetchAll: true },
    site: "https://www.andreadiotalleviart.com",
    image: { service: imageService({ placeholder: "lqip" }) },
})
