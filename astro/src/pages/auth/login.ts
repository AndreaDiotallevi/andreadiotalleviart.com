import type { APIRoute } from "astro"
import {
    ADMIN_LOGIN_RETURN_TO_COOKIE_NAME,
    ADMIN_LOGIN_STATE_COOKIE_NAME,
    buildCognitoAuthorizeUrl,
    getLoginStateMaxAgeSeconds,
    getSafeInternalPath,
    shouldUseSecureCookie,
} from "@utils/auth"

export const prerender = false
const NOINDEX_ROBOTS_TAG = "noindex, nofollow, noarchive"

export const GET: APIRoute = async ({ cookies, url }) => {
    try {
        const state = crypto.randomUUID()
        const returnTo = getSafeInternalPath(url.searchParams.get("returnTo"), "/admin")
        const secure = shouldUseSecureCookie(url)
        const stateMaxAge = getLoginStateMaxAgeSeconds()

        cookies.set(ADMIN_LOGIN_STATE_COOKIE_NAME, state, {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure,
            maxAge: stateMaxAge,
        })
        cookies.set(ADMIN_LOGIN_RETURN_TO_COOKIE_NAME, returnTo, {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure,
            maxAge: stateMaxAge,
        })

        const authorizeUrl = buildCognitoAuthorizeUrl({ url, state })

        return new Response(null, {
            status: 302,
            headers: {
                Location: authorizeUrl,
                "X-Robots-Tag": NOINDEX_ROBOTS_TAG,
            },
        })
    } catch (error) {
        return new Response("Authentication is not configured.", {
            status: 500,
            headers: { "X-Robots-Tag": NOINDEX_ROBOTS_TAG },
        })
    }
}
