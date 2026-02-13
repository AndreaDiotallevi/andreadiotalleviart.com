import type { APIRoute } from "astro"
import {
    ADMIN_SESSION_COOKIE_NAME,
    buildCognitoLogoutUrl,
    shouldUseSecureCookie,
} from "@utils/auth"

export const prerender = false

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
            headers: { Location: logoutUrl },
        })
    } catch (error) {
        return new Response(null, {
            status: 302,
            headers: { Location: "/" },
        })
    }
}
