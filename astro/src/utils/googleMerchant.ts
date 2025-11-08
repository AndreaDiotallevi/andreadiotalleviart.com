import { getStripeProducts } from "./serverless"
import { buildLocaleUrl, defaultLocale, localeToCurrency, eurCountryCodes } from "./currency"

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
    const countryForLocale = (() => {
        if (locale === "en-gb") return "GB"
        if (locale === "en-us") return "US"
        // EU default (request: only Italy for now)
        return "IT"
    })()
    // Keep only shipping country + free price; avoid extra shipping details not explicitly shown on the site

    const products = await getStripeProducts()

    const seenBySlug = new Set<string>()
    const items = products
        .map(product => {
            const imageLinks = product.images ?? []
            const imageLink = imageLinks[0] ?? ""
            const additionalImages = imageLinks
                .slice(1)
                .map(url => `\n      <g:additional_image_link>${escapeXml(url)}</g:additional_image_link>`)
                .join("")
            const minor = product.default_price.currency_options[currency].unit_amount
            const price = (minor / 100).toFixed(2) + ` ${currencyUpper}`
            const path = buildLocaleUrl(`/shop/${product.metadata.category}/${product.metadata.slug}`, locale as any)
            const baseLink = `${baseUrl}${path}`
            const slug = product.metadata.slug
            // For additional sizes of the same slug, include a size query param
            const link =
                seenBySlug.has(slug)
                    ? `${baseLink}?size=${encodeURIComponent(product.metadata.size)}`
                    : baseLink
            seenBySlug.add(slug)
            const title = `${product.metadata.displayName || product.name} | Giclée Fine Art Print`
            const description = product.description || title
            const itemGroupId = product.metadata.slug
            const size = product.metadata.size
            const mpn = product.metadata.sku
            const material = "Giclée print on Hahnemühle Photo Rag 308gsm"
            const productType = "Prints > Fine Art Prints"
            const shippingDims = { length: "50 cm", width: "10 cm", height: "10 cm" }
            const highlights = [
                "Museum-quality giclée fine art print",
                "Hahnemühle Photo Rag 308gsm cotton paper",
                "Archival pigment inks; free carbon‑neutral shipping",
            ]
            const details = [
                { section: "Specifications", name: "Technique", value: "Giclée" },
                { section: "Specifications", name: "Paper", value: "Hahnemühle Photo Rag 308gsm" },
                { section: "Specifications", name: "Orientation", value: product.metadata.orientation },
            ]

            return `
    <item>
      <g:id>${escapeXml(product.metadata.sku || product.id)}</g:id>
      <title>${escapeXml(title)}</title>
      <description>${escapeXml(description)}</description>
      <link>${escapeXml(link)}</link>
      <g:mobile_link>${escapeXml(link)}</g:mobile_link>
      <g:image_link>${escapeXml(imageLink)}</g:image_link>
      ${additionalImages}
      <g:availability>in stock</g:availability>
      <g:condition>new</g:condition>
      <g:price>${price}</g:price>
      <g:country>${escapeXml(countryForLocale)}</g:country>
      <g:brand>${escapeXml(brand)}</g:brand>
      <g:identifier_exists>false</g:identifier_exists>
      <g:google_product_category>500044</g:google_product_category>
      <g:product_type>${escapeXml(productType)}</g:product_type>
      <g:item_group_id>${escapeXml(itemGroupId)}</g:item_group_id>
      <g:size>${escapeXml(size)}</g:size>
      <g:material>${escapeXml(material)}</g:material>
      <g:mpn>${escapeXml(mpn)}</g:mpn>
      ${highlights.map(h => `\n      <g:product_highlight>${escapeXml(h)}</g:product_highlight>`).join("")}
      ${details
          .map(
              d => `
      <g:product_detail>
        <g:section_name>${escapeXml(d.section)}</g:section_name>
        <g:attribute_name>${escapeXml(d.name)}</g:attribute_name>
        <g:attribute_value>${escapeXml(d.value)}</g:attribute_value>
      </g:product_detail>`,
          )
          .join("")}
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

export async function generateGoogleMerchantSupplementalXml(locale: keyof typeof localeToCurrency) {
    const baseUrl = "https://andreadiotalleviart.com"
    const currency = localeToCurrency[locale]
    const currencyUpper = currency.toUpperCase()
    const products = await getStripeProducts()
    // Only override id, link, price and shipping(country+price)
    const countries = (() => {
        if (locale === "en") return ["IT"] // EU: just Italy for now
        if (locale === "en-us") return ["US"]
        return ["GB"]
    })()

    const seenBySlug = new Set<string>()
    const items = products
        .map(product => {
            const path = buildLocaleUrl(`/shop/${product.metadata.category}/${product.metadata.slug}`, locale as any)
            const baseLink = `${baseUrl}${path}`
            const slug = product.metadata.slug
            const minor = product.default_price.currency_options[currency].unit_amount
            const price = (minor / 100).toFixed(2) + ` ${currencyUpper}`

            return countries
                .map(countryCode => {
                    const link =
                        seenBySlug.has(slug)
                            ? `${baseLink}?size=${encodeURIComponent(product.metadata.size)}`
                            : baseLink
                    seenBySlug.add(slug)
                    return `
    <item>
      <g:id>${escapeXml(product.metadata.sku || product.id)}</g:id>
      <link>${escapeXml(link)}</link>
      <g:price>${price}</g:price>
      <g:country>${escapeXml(countryCode)}</g:country>
    </item>`
                })
                .join("")
        })
        .join("")

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Supplemental Feed (${locale})</title>
    <link>${baseUrl}</link>
    <description>${escapeXml("Supplemental feed to override per-locale product links")}</description>
    ${items}
  </channel>
</rss>`

    return rss
}
