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
    integrations: [tailwind(), sentry({
        org: process.env.PUBLIC_SENTRY_ORG,
        project: process.env.PUBLIC_SENTRY_PROJECT,
        authToken: process.env.PUBLIC_SENTRY_AUTH_TOKEN,
    })],
    prefetch: { defaultStrategy: "load", prefetchAll: false },
    site: "https://www.andreadiotalleviart.com",
    image: { service: imageService({ placeholder: "lqip" }) },
})
