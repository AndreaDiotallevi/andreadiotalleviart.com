import { purgeCache } from "@netlify/functions"
import { getParameterValue } from "./ssm_getParameterValue"

export const purgeNetlifyCache = async () => {
    if (process.env.ENVIRONMENT === "sandbox") return

    const token = await getParameterValue<string>({
        name: "NETLIFY_ACCESS_TOKEN",
        withDecryption: true,
    })

    const siteID = await getParameterValue<string>({
        name: "NETLIFY_SITE_ID",
        withDecryption: true,
    })

    const origin = await getParameterValue<string>({
        name: "CORS_ALLOW_ORIGIN",
    })

    console.log("Purging Netlify Cache...")

    await purgeCache({
        token,
        siteID,
        tags: ["stripe"],
        domain: origin.split("https://")[1],
    })

    return new Response("Purged!", { status: 202 })
}
