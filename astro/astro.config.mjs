import { defineConfig } from "astro/config"
import { imageService } from "@unpic/astro/service"

import tailwind from "@astrojs/tailwind"

import netlify from "@astrojs/netlify"

// https://astro.build/config
export default defineConfig({
    output: "hybrid",
    adapter: netlify({ edgeMiddleware: true }),
    integrations: [tailwind()],
    experimental: { serverIslands: true },
    prefetch: { defaultStrategy: "viewport" },
    site: "https://www.andreadiotalleviart.com",
    image: { service: imageService({ placeholder: "lqip" }) },
})
