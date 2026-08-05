import type { APIRoute } from "astro"
import {
    ADMIN_SESSION_COOKIE_NAME,
    buildCognitoLogoutUrl,
    shouldUseSecureCookie,
} from "@utils/auth"

export const prerender = false
const NOINDEX_ROBOTS_TAG = "noindex, nofollow, noarchive"

export const GET: APIRoute = async ({ cookies, url }) => {
    cookies.set(ADMIN_SESSION_COOKIE_NAME, "", {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: shouldUseSecureCookie(url),
        maxAge: 0,
    })

    try {
        const logoutUrl = buildCognitoLogoutUrl({ url })
        return new Response(null, {
            status: 302,
            headers: {
                Location: logoutUrl,
                "X-Robots-Tag": NOINDEX_ROBOTS_TAG,
            },
        })
    } catch (error) {
        return new Response(null, {
            status: 302,
            headers: {
                Location: "/",
                "X-Robots-Tag": NOINDEX_ROBOTS_TAG,
            },
        })
    }
}
