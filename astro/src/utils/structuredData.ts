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
    pageLocale?: string
}

import { eurCountryCodes } from "./currency"

export function generateStructuredData(options: GenerateStructuredDataOptions) {
    const { siteOrigin, pageUrl, pageTitle, product, offerPrice, offerCurrency, pageLocale } = options

    // Map page locale to destination country and delivery window
    const localeToCountry: Record<string, string> = {
        "en-gb": "GB",
        "en-us": "US",
        "en": "EU",
    }
    const destinationCountry = pageLocale ? (localeToCountry[pageLocale.toLowerCase()] || "GB") : "GB"
    const isUK = destinationCountry === "GB"
    const transitMinDays = isUK ? 7 : 14
    const transitMaxDays = isUK ? 14 : 21

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

    graph.push({
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: pageTitle,
        isPartOf: { "@id": `${siteOrigin}/#website` },
        about: { "@id": `${siteOrigin}/#organization` },
    })

    if (product) {
        graph.push(
            {
                "@type": "Product",
                "@id": `${pageUrl}#product`,
                name: product.name,
                description: product.description,
                url: pageUrl,
                mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
                image: product.imageUrls,
                sku: product.sku,
                brand: { "@type": "Brand", name: "Andrea Diotallevi Art" },
                additionalType: "https://schema.org/VisualArtwork",
                material: product.material,
                ...(typeof product.widthCm === "number"
                    ? { width: buildDimensionQuantitativeValue(product.widthCm) }
                    : {}),
                ...(typeof product.heightCm === "number"
                    ? { height: buildDimensionQuantitativeValue(product.heightCm) }
                    : {}),
                offers: buildSingleOffer({
                    url: pageUrl,
                    price: offerPrice,
                    priceCurrency: offerCurrency,
                    sku: product.sku,
                    destinationCountry,
                    transitMinDays,
                    transitMaxDays,
                }) as any,
            }
        )
    }

    return {
        "@context": "https://schema.org",
        "@graph": graph,
    }
}

function buildSingleOffer(params: {
    url: string
    price: number | string
    priceCurrency: string
    sku: string
    destinationCountry: string
    transitMinDays: number
    transitMaxDays: number
}) {
    const normalizedPrice = typeof params.price === "string" ? params.price : params.price.toFixed(2)
    const currency = params.priceCurrency.toUpperCase()

    const baseShippingDetails = {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: "0.00", currency },
        deliveryTime: {
            "@type": "ShippingDeliveryTime",
            handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 0, unitCode: "d" },
            transitTime: {
                "@type": "QuantitativeValue",
                minValue: params.transitMinDays,
                maxValue: params.transitMaxDays,
                unitCode: "d",
            },
        },
    }

    // For EU locale, restrict shipping destination to Ireland only (IE)
    const shippingDetails =
        params.destinationCountry === "EU"
            ? ([
                  {
                      ...baseShippingDetails,
                      shippingDestination: { "@type": "DefinedRegion", addressCountry: "IE" },
                  },
              ] as unknown[])
            : ({
                  ...baseShippingDetails,
                  shippingDestination: { "@type": "DefinedRegion", addressCountry: params.destinationCountry },
              } as unknown)

    const siteOrigin = new URL(params.url).origin
    
    return {
        "@type": "Offer",
        url: params.url,
        price: normalizedPrice,
        priceCurrency: currency,
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        sku: params.sku,
        hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
            merchantReturnDays: 14,
            returnMethod: "https://schema.org/ReturnByMail",
            returnFees: "https://schema.org/FreeReturn",
            refundType: "https://schema.org/FullRefund",
            merchantReturnLink: `${siteOrigin}/return-policy`,
        },
        shippingDetails,
    }
}

function buildDimensionQuantitativeValue(valueCm: number) {
    return {
        "@type": "QuantitativeValue",
        value: Number(valueCm.toFixed(1)),
        unitCode: "CMT",
    }
}
