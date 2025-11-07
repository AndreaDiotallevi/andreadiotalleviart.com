import { defineConfig } from "astro/config"
import { imageService } from "@unpic/astro/service"
import tailwind from "@astrojs/tailwind"
import netlify from "@astrojs/netlify"
import sentry from "@sentry/astro";

// https://astro.build/config
export default defineConfig({
    output: "static",
    adapter: netlify(),
    trailingSlash: "never",
    build: { format: "file" },
    integrations: [tailwind(), sentry()],
    prefetch: { defaultStrategy: "load", prefetchAll: false },
    site: "https://andreadiotalleviart.com",
    image: { service: imageService({ placeholder: "lqip" }) },
})
