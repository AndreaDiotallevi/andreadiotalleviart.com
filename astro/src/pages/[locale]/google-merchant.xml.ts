export const prerender = true

import { localeToCurrency, supportedLocales, defaultLocale } from "@utils/currency"
import { generateGoogleMerchantXml } from "@utils/googleMerchant"

export async function getStaticPaths() {
    return supportedLocales
        .filter(locale => locale !== defaultLocale)
        .map(locale => ({ params: { locale } }))
}

export async function GET({ params }: { params: { locale: keyof typeof localeToCurrency } }) {
    const locale = params.locale
    const rss = await generateGoogleMerchantXml(locale)

    return new Response(rss, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=0, must-revalidate",
        },
    })
}
