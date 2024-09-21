/// <reference path="../.astro/types.d.ts" />

type NetlifyLocals = import("@astrojs/netlify").NetlifyLocals

declare namespace App {
    interface Locals extends NetlifyLocals {
        // ...
    }
}

interface ImportMetaEnv {
    readonly CLOUDINARY_API_KEY: string
    readonly CLOUDINARY_API_SECRET: string
    readonly CLOUDINARY_CLOUD_NAME: string
    readonly GA4_TRACKING_ID: string
    readonly IMAGES_DOMAIN: string
    readonly PUBLIC_STRIPE_PUBLISHABLE_KEY: string
    readonly PUBLIC_API_URL: string
    readonly PUBLIC_API_KEY: string
    readonly STRIPE_SECRET_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
