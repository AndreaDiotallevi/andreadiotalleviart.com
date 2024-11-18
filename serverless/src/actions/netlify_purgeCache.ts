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

    console.log("Purging Netlify Cache...")

    await purgeCache({ token, siteID, tags: ["stripe"] })

    return new Response("Purged!", { status: 202 })
}
