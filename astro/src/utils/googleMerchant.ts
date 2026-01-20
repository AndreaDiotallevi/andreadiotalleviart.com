import { getStripeProducts } from "./serverless"
import { buildLocaleUrl, defaultLocale, localeToCurrency } from "./currency"

function escapeXml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;")
}

export async function generateGoogleMerchantXml(locale: keyof typeof localeToCurrency = defaultLocale) {
    const baseUrl = "https://andreadiotalleviart.com"
    const brand = "Andrea Diotallevi Art"
    const currency = localeToCurrency[locale]
    const currencyUpper = currency.toUpperCase()

    const products = await getStripeProducts()

    const items = products
        .map(product => {
            // Exclude specific mockup image(s) from Merchant Center feed
            const blockedImageSubstrings = ["mockup-series-vertical_hpqksb"]
            const imageLinks = (product.images ?? []).filter(url =>
                !blockedImageSubstrings.some(sub => url.includes(sub))
            )
            const imageLink = imageLinks[0] ?? ""
            const additionalImages = imageLinks
                .slice(1)
                .map(url => `\n      <g:additional_image_link>${escapeXml(url)}</g:additional_image_link>`)
                .join("")
            const minor = product.default_price.currency_options[currency].unit_amount
            const price = (minor / 100).toFixed(2) + ` ${currencyUpper}`
            const path = buildLocaleUrl(`/shop/${product.metadata.category}/${product.metadata.slug}`, locale as any)
            const link = `${baseUrl}${path}`
            const title = product.name
            const description = product.description

            return `
    <item>
      <g:id>${escapeXml(product.metadata.sku || product.id)}</g:id>
      <g:item_group_id>${escapeXml(product.metadata.slug)}</g:item_group_id>
      <title>${escapeXml(title)}</title>
      <description>${escapeXml(description)}</description>
      <link>${escapeXml(link)}</link>
      <g:image_link>${escapeXml(imageLink)}</g:image_link>
      ${additionalImages}
      <g:availability>in stock</g:availability>
      <g:condition>new</g:condition>
      <g:price>${price}</g:price>
      <g:brand>${escapeXml(brand)}</g:brand>
      <g:identifier_exists>false</g:identifier_exists>
      <g:google_product_category>500044</g:google_product_category>
    </item>`
        })
        .join("")

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(brand)} Product Feed (${currencyUpper})</title>
    <link>${baseUrl}</link>
    <description>${escapeXml("Giclée fine art prints feed for Google Merchant Center")}</description>
    ${items}
  </channel>
</rss>`

    return rss
}
