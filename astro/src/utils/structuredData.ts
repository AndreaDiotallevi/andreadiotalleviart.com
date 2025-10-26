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
    product?: ProductJsonLdInput
    offerPrice: number | string
    offerCurrency: string
}

export function generateStructuredData(options: GenerateStructuredDataOptions) {
    const { siteOrigin, pageUrl, pageTitle, product, offerPrice, offerCurrency } = options

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

    if (product) {
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
                offers: buildSingleOffer({
                    url: pageUrl,
                    price: offerPrice,
                    priceCurrency: offerCurrency,
                    sku: product.sku,
                    widthCm: product.widthCm,
                    heightCm: product.heightCm,
                }),
            }
        )
    }

    return {
        "@context": "https://schema.org",
        "@graph": graph,
    }
}

function buildSingleOffer(params: { url: string; price: number | string; priceCurrency: string; sku: string; widthCm?: number; heightCm?: number }) {
    const normalizedPrice = typeof params.price === "string" ? params.price : params.price.toFixed(2)
    const currency = params.priceCurrency.toUpperCase()

    return {
        "@type": "Offer",
        url: params.url,
        price: normalizedPrice,
        priceCurrency: currency,
        availability: "https://schema.org/InStock",
        sku: params.sku,
        itemOffered: {
            "@type": "Product",
            width: {
                "@type": "QuantitativeValue",
                value: params.widthCm,
                unitText: "cm",
            },
            height: {
                "@type": "QuantitativeValue",
                value: params.heightCm,
                unitText: "cm",
            },
        },
        hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
            merchantReturnDays: 14,
        },
        shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingRate: { "@type": "MonetaryAmount", value: "0.00", currency },
            deliveryTime: {
                "@type": "ShippingDeliveryTime",
                handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 3, unitCode: "d" },
                transitTime: { "@type": "QuantitativeValue", minValue: 7, maxValue: 21, unitCode: "d" },
            },
            shippingDestination: { "@type": "DefinedRegion", addressCountry: "GB" },
        },
    }
}
