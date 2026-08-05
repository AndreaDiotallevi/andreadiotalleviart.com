/// <reference path="../.astro/types.d.ts" />

type NetlifyLocals = import("@astrojs/netlify").NetlifyLocals

declare namespace App {
    interface Locals extends NetlifyLocals {
        // ...
    }
}

interface ImportMetaEnv {
    readonly COGNITO_AUTH_DOMAIN: string
    readonly COGNITO_CLIENT_ID: string
    readonly COGNITO_CLIENT_SECRET: string
    readonly COGNITO_REGION?: string
    readonly COGNITO_USER_POOL_ID: string
    readonly CLOUDINARY_API_KEY: string
    readonly CLOUDINARY_API_SECRET: string
    readonly CLOUDINARY_CLOUD_NAME: string
    readonly GA4_TRACKING_ID: string
    readonly IMAGES_DOMAIN: string
    readonly PUBLIC_SENTRY_DSN: string
    readonly PUBLIC_STRIPE_PUBLISHABLE_KEY: string
    readonly PUBLIC_API_URL: string
    readonly PUBLIC_API_KEY: string
    readonly PUBLIC_ENV: "sandbox" | "staging" | "production"
    readonly STRIPE_SECRET_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
