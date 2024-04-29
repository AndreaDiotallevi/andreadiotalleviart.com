import { graphql } from "gatsby"
import { IGatsbyImageData } from "gatsby-plugin-image"

export type StripePrice = {
    id: string
    active: boolean
    currency: string
    unit_amount: number
    artwork: {
        childImageSharp: {
            gatsbyImageData: IGatsbyImageData
            original: {
                src: string
            }
        }
    }
    mockup: {
        childImageSharp: {
            gatsbyImageData: IGatsbyImageData
            original: {
                src: string
            }
        }
    }
    product: {
        id: string
        name: string
        description: string
        metadata: {
            category: "prints"
            slug: "marble-lake" | "flames" | "moonlight-2" | "new-york"
            size: "A1" | "A2" | "A3"
            prodigiSku: "GLOBAL-HPR-A1" | "GLOBAL-HPR-A2" | "GLOBAL-HPR-A3"
            displayName: string
            orientation: "portrait" | "landscape"
            displayOrder: number
        }
    }
}

export const query = graphql`
    fragment StripePriceFragment on StripePrice {
        id
        active
        currency
        unit_amount
        artwork {
            childImageSharp {
                gatsbyImageData(
                    width: 1400
                    quality: 99
                    layout: CONSTRAINED
                    placeholder: BLURRED
                )
                original {
                    src
                }
            }
        }
        mockup {
            childImageSharp {
                gatsbyImageData(
                    width: 1414
                    quality: 99
                    layout: CONSTRAINED
                    placeholder: BLURRED
                )
                original {
                    src
                }
            }
        }
        product {
            id
            name
            description
            metadata {
                category
                size
                slug
                prodigiSku
                displayName
                orientation
                displayOrder
            }
        }
    }
`
