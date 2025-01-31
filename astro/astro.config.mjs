import { defineConfig } from "astro/config"
import { imageService } from "@unpic/astro/service"
import tailwind from "@astrojs/tailwind"
import netlify from "@astrojs/netlify"

// https://astro.build/config
export default defineConfig({
    output: "static",
    adapter: netlify(),
    trailingSlash: "never",
    build: { format: "file" },
    integrations: [tailwind()],
    prefetch: { defaultStrategy: "load", prefetchAll: true },
    site: "https://www.andreadiotalleviart.com",
    image: { service: imageService({ placeholder: "lqip" }) },
})
