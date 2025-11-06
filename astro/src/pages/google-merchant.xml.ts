export const prerender = true

import { defaultLocale } from "@utils/currency"
import { generateGoogleMerchantXml } from "@utils/googleMerchant"

export async function GET() {
    const rss = await generateGoogleMerchantXml(defaultLocale)
    return new Response(rss, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=0, must-revalidate",
        },
    })
}
