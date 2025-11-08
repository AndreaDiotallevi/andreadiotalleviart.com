export const prerender = true

import { generateGoogleMerchantSupplementalXml } from "@utils/googleMerchant"

export async function GET() {
    const rss = await generateGoogleMerchantSupplementalXml("en-us")
    return new Response(rss, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=0, must-revalidate",
        },
    })
}


