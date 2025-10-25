export interface OfferInput {
    url?: string
    price: number | string
    priceCurrency: string
    availability?: string
    sku?: string
    size?: string
    widthCm?: number
    heightCm?: number
    itemOfferedName?: string
    shippingDetails?: {
        shippingRate?: { value: number | string; currency: string }
        deliveryTimeDays?: { min?: number; max?: number }
        shippingDestinationCountry?: string
    }
}

export interface ProductJsonLdInput {
    name: string
    description: string
    imageUrls: string[]
    sku: string
    material?: string
    widthCm?: number
    heightCm?: number
    offers?: OfferInput[]
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
                ...(product.offers && product.offers.length
                    ? buildOffers(product.offers)
                    : {}),
            }
        )
    }

    return {
        "@context": "https://schema.org",
        "@graph": graph,
    }
}

function buildOffers(offers: OfferInput[]) {
    if (!offers.length) return {}

    if (offers.length === 1) {
        const [o] = offers
        return {
            offers: toOffer(o),
        }
    }

    const numericPrices = offers
        .map(o => (typeof o.price === "string" ? parseFloat(o.price) : o.price))
        .filter(p => Number.isFinite(p)) as number[]

    const lowPrice = Math.min(...numericPrices)
    const highPrice = Math.max(...numericPrices)
    const priceCurrency = offers[0]?.priceCurrency

    return {
        offers: {
            "@type": "AggregateOffer",
            offerCount: offers.length,
            lowPrice,
            highPrice,
            priceCurrency,
            offers: offers.map(toOffer),
        },
    }
}

function toOffer(o: OfferInput) {
    return {
        "@type": "Offer",
        url: o.url,
        price: typeof o.price === "string" ? o.price : o.price.toFixed(2),
        priceCurrency: o.priceCurrency,
        availability: o.availability || "https://schema.org/InStock",
        sku: o.sku,
        // Intentionally omit itemOffered to avoid creating a second Product entity
        ...(o.shippingDetails
            ? {
                  shippingDetails: {
                      "@type": "OfferShippingDetails",
                      ...(o.shippingDetails.shippingRate
                          ? {
                                shippingRate: {
                                    "@type": "MonetaryAmount",
                                    value: typeof o.shippingDetails.shippingRate.value === "string"
                                        ? o.shippingDetails.shippingRate.value
                                        : o.shippingDetails.shippingRate.value.toFixed(2),
                                    currency: o.shippingDetails.shippingRate.currency,
                                },
                            }
                          : {}),
                      ...(o.shippingDetails.deliveryTimeDays
                          ? {
                                deliveryTime: {
                                    "@type": "ShippingDeliveryTime",
                                    transitTime: {
                                        "@type": "QuantitativeValue",
                                        ...(o.shippingDetails.deliveryTimeDays.min !== undefined
                                            ? { minValue: o.shippingDetails.deliveryTimeDays.min }
                                            : {}),
                                        ...(o.shippingDetails.deliveryTimeDays.max !== undefined
                                            ? { maxValue: o.shippingDetails.deliveryTimeDays.max }
                                            : {}),
                                        unitCode: "d",
                                    },
                                },
                            }
                          : {}),
                      ...(o.shippingDetails.shippingDestinationCountry
                          ? {
                                shippingDestination: {
                                    "@type": "DefinedRegion",
                                    addressCountry: o.shippingDetails.shippingDestinationCountry,
                                },
                            }
                          : {}),
                  },
              }
            : {}),
    }
}
