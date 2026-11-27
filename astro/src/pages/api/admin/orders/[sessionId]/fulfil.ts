import type { APIRoute } from "astro"
import {
    ADMIN_SESSION_COOKIE_NAME,
    isAdminUser,
    verifyAdminSessionToken,
} from "@utils/auth"

export const prerender = false
const NOINDEX_ROBOTS_TAG = "noindex, nofollow, noarchive"

const orderPageUrl = (
    sessionId: string,
    outcome: "ordered" | "error",
    message: string,
) =>
    `/admin/orders/${encodeURIComponent(sessionId)}?fulfilment=${outcome}&message=${encodeURIComponent(message)}`

export const POST: APIRoute = async ({ cookies, params, redirect }) => {
    const sessionToken = cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value
    const sessionClaims = sessionToken
        ? await verifyAdminSessionToken(sessionToken)
        : null

    if (!sessionClaims || !isAdminUser(sessionClaims.groups)) {
        return new Response("Unauthorized", {
            status: 401,
            headers: { "X-Robots-Tag": NOINDEX_ROBOTS_TAG },
        })
    }

    const sessionId = params.sessionId
    if (!sessionId) {
        return new Response("Missing session id", { status: 400 })
    }

    const apiUrl = import.meta.env.PUBLIC_API_URL
    const adminSecret = import.meta.env.ADMIN_API_SECRET
    if (!apiUrl || !adminSecret) {
        return redirect(
            orderPageUrl(sessionId, "error", "Admin API is not configured."),
            303,
        )
    }

    try {
        const response = await fetch(
            `${apiUrl}/admin/orders/${encodeURIComponent(sessionId)}/fulfil`,
            {
                method: "POST",
                headers: { "X-Admin-Secret": adminSecret },
            },
        )
        const data = (await response.json().catch(() => ({}))) as {
            orderNumber?: string
            message?: string
            blockers?: string[]
        }

        if (response.status === 201) {
            return redirect(
                orderPageUrl(
                    sessionId,
                    "ordered",
                    `Order ${data.orderNumber ?? ""} placed with theprintspace.`,
                ),
                303,
            )
        }

        const reason = data.blockers?.length
            ? data.blockers.join(" ")
            : (data.message ?? `Order failed (status ${response.status}).`)
        return redirect(orderPageUrl(sessionId, "error", reason), 303)
    } catch {
        return redirect(
            orderPageUrl(
                sessionId,
                "error",
                "Could not reach the order service. Check the CreativeHub order list before retrying.",
            ),
            303,
        )
    }
}
