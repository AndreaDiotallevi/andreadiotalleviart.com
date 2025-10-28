import { getStripeProducts } from "@utils/serverless"

function escapeXml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;")
}

export async function GET() {
    const baseUrl = "https://andreadiotalleviart.com"
    const brand = "Andrea Diotallevi Art"
    const currency = "GBP"

    const products = await getStripeProducts()

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(brand)} Product Feed</title>
    <link>${baseUrl}</link>
    <description>${escapeXml("Giclée fine art prints feed for Google Merchant Center")}</description>
    ${products
        .map(product => {
            const imageLink = product.images?.[0] ?? ""
            const priceMinorUnits = product.default_price.currency_options[currency.toLowerCase() as "gbp"].unit_amount
            const price = (priceMinorUnits / 100).toFixed(2) + ` ${currency}`
            const link = `${baseUrl}/shop/${product.metadata.category}/${product.metadata.slug}`
            const title = product.metadata.displayName || product.name
            const description = product.description || title

            return `
    <item>
      <g:id>${escapeXml(product.metadata.sku || product.id)}</g:id>
      <title>${escapeXml(title)}</title>
      <description>${escapeXml(description)}</description>
      <link>${escapeXml(link)}</link>
      <g:image_link>${escapeXml(imageLink)}</g:image_link>
      <g:availability>in stock</g:availability>
      <g:condition>new</g:condition>
      <g:price>${price}</g:price>
      <g:brand>${escapeXml(brand)}</g:brand>
      <g:identifier_exists>false</g:identifier_exists>
      <g:google_product_category>Arts &amp; Entertainment &gt; Hobbies &amp; Creative Arts &gt; Artwork &gt; Posters &amp; Prints</g:google_product_category>
    </item>`
        })
        .join("")}
  </channel>
</rss>`

    return new Response(rss, {
        headers: {
            "Content-Type": "application/xml",
            // Cache conservatively; Netlify/edge can override as needed
            "Cache-Control": "public, max-age=0, must-revalidate",
        },
    })
}
