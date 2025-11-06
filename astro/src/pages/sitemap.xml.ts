import { getStripeProducts } from "@utils/serverless"
import { getCollection } from "astro:content"
import { supportedLocales } from "@utils/currency"

export async function GET() {
    const products = await getStripeProducts()
    const artworks = await getCollection("artworks")
    const baseUrl = "https://andreadiotalleviart.com"
    const locales = supportedLocales

    const urls = [
        `${baseUrl}`,
        `${baseUrl}/about`,
        `${baseUrl}/contact`,
        `${baseUrl}/return-policy`,
        `${baseUrl}/portfolio`,
        // Locale-prefixed shop listings
        ...locales.map(locale => `${baseUrl}/${locale}/shop`),
        // Locale-prefixed product pages
        ...products.flatMap(product =>
            locales.map(
                locale =>
                    `${baseUrl}/${locale}/shop/${product.metadata.category}/${product.metadata.slug}`,
            ),
        ),
        // Portfolio items
        ...artworks.map(artwork => `${baseUrl}/portfolio/${artwork.data.slug}`),
    ]

    urls.sort()

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
                xmlns:xhtml="http://www.w3.org/1999/xhtml"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
            ${urls
                .map(
                    url => `
                    <url>
                        <loc>${url}</loc>
                    </url>`,
                )
                .join("")}
        </urlset>`

    return new Response(sitemap, {
        headers: {
            "Content-Type": "application/xml",
        },
    })
}
