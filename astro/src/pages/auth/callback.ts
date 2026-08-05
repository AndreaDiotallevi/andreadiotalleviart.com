import type { APIRoute } from "astro"
import {
    ADMIN_LOGIN_RETURN_TO_COOKIE_NAME,
    ADMIN_LOGIN_STATE_COOKIE_NAME,
    ADMIN_SESSION_COOKIE_NAME,
    exchangeCodeForIdToken,
    getAdminSessionMaxAgeSeconds,
    getSafeInternalPath,
    shouldUseSecureCookie,
    verifyAdminSessionToken,
} from "@utils/auth"

export const prerender = false
const NOINDEX_ROBOTS_TAG = "noindex, nofollow, noarchive"

export const GET: APIRoute = async ({ cookies, url }) => {
    const code = url.searchParams.get("code")
    const state = url.searchParams.get("state")
    const stateFromCookie = cookies.get(ADMIN_LOGIN_STATE_COOKIE_NAME)?.value
    const returnTo = getSafeInternalPath(
        cookies.get(ADMIN_LOGIN_RETURN_TO_COOKIE_NAME)?.value,
        "/admin",
    )

    cookies.set(ADMIN_LOGIN_STATE_COOKIE_NAME, "", {
        path: "/",
        maxAge: 0,
    })
    cookies.set(ADMIN_LOGIN_RETURN_TO_COOKIE_NAME, "", {
        path: "/",
        maxAge: 0,
    })

    if (!code || !state || !stateFromCookie || stateFromCookie !== state) {
        return new Response("Authentication request is invalid.", {
            status: 400,
            headers: { "X-Robots-Tag": NOINDEX_ROBOTS_TAG },
        })
    }

    try {
        const idToken = await exchangeCodeForIdToken({ code, url })
        const sessionClaims = await verifyAdminSessionToken(idToken)

        if (!sessionClaims) {
            cookies.set(ADMIN_SESSION_COOKIE_NAME, "", {
                path: "/",
                maxAge: 0,
            })
            return new Response("Unable to verify authenticated user.", {
                status: 401,
                headers: { "X-Robots-Tag": NOINDEX_ROBOTS_TAG },
            })
        }

        cookies.set(ADMIN_SESSION_COOKIE_NAME, idToken, {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: shouldUseSecureCookie(url),
            maxAge: getAdminSessionMaxAgeSeconds(),
        })

        return new Response(null, {
            status: 302,
            headers: {
                Location: returnTo,
                "X-Robots-Tag": NOINDEX_ROBOTS_TAG,
            },
        })
    } catch (error) {
        return new Response("Authentication failed.", {
            status: 401,
            headers: { "X-Robots-Tag": NOINDEX_ROBOTS_TAG },
        })
    }
}
