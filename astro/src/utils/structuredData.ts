export interface ProductJsonLdInput {
    name: string
    description: string
    imageUrls: string[]
    sku: string
    material?: string
    widthCm?: number
    heightCm?: number
}

export interface GenerateStructuredDataOptions {
    siteOrigin: string
    pageUrl: string
    pageTitle: string
    includeProduct: boolean
    product?: ProductJsonLdInput
}

export function generateStructuredData(options: GenerateStructuredDataOptions) {
    const { siteOrigin, pageUrl, pageTitle, includeProduct, product } = options

    const graph: unknown[] = [
        {
            "@type": "WebSite",
            "@id": `${siteOrigin}/#website`,
            name: "Andrea Diotallevi Art",
            url: siteOrigin,
            publisher: { "@id": `${siteOrigin}/#organization` },
        },
        {
            "@type": "Organization",
            "@id": `${siteOrigin}/#organization`,
            name: "Andrea Diotallevi Art",
            url: siteOrigin,
            logo: {
                "@type": "ImageObject",
                url: `${siteOrigin}/logo.png`,
                width: 750,
                height: 750,
            },
            sameAs: [
                "https://twitter.com/adiotalleviart",
                "https://www.instagram.com/andreadiotalleviart",
                "https://andreadiotalleviart.tumblr.com",
            ],
            contactPoint: {
                "@type": "ContactPoint",
                url: `${siteOrigin}/contact`,
                contactType: "Customer Support",
            },
        },
    ]

    if (includeProduct && product) {
        graph.push(
            {
                "@type": "WebPage",
                "@id": `${pageUrl}#webpage`,
                url: pageUrl,
                name: pageTitle,
                isPartOf: { "@id": `${siteOrigin}/#website` },
                about: { "@id": `${siteOrigin}/#organization` },
            },
            {
                "@type": "Product",
                "@id": `${pageUrl}#product`,
                name: product.name,
                description: product.description,
                url: pageUrl,
                image: product.imageUrls,
                sku: product.sku,
                brand: { "@type": "Brand", name: "Andrea Diotallevi Art" },
                additionalType: "https://schema.org/VisualArtwork",
                material: product.material,
                width: product.widthCm
                    ? { "@type": "QuantitativeValue", value: product.widthCm, unitText: "cm" }
                    : undefined,
                height: product.heightCm
                    ? { "@type": "QuantitativeValue", value: product.heightCm, unitText: "cm" }
                    : undefined,
            }
        )
    }

    return {
        "@context": "https://schema.org",
        "@graph": graph,
    }
}
