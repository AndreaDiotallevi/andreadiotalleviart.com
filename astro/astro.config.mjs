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
    vite: {
        build: {
            chunkSizeWarningLimit: 900,
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes("node_modules")) {
                            const match = id.match(/node_modules\/(?:@[^\/]+\/[^\/]+|[^\/]+)/)
                            const pkgName = match ? match[0].replace("node_modules/", "") : null

                            if (pkgName) {
                                if (pkgName.startsWith("@sentry")) return "vendor-sentry"
                                if (pkgName === "@stripe/stripe-js" || pkgName === "stripe") return "vendor-stripe"
                                if (pkgName === "p5") return "vendor-p5"
                                if (pkgName === "embla-carousel") return "vendor-embla"
                                if (pkgName === "zod") return "vendor-zod"
                            }
                            return "vendor"
                        }
                    },
                },
            },
        },
    },
})
