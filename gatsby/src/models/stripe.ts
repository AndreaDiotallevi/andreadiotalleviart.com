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
            slug: "marble-lake" | "flames"
            size:
                | "A1 (594 x 841 mm)"
                | "A2 (420 x 594 mm)"
                | "A3 (297 x 420 mm)"
            prodigiSku: "GLOBAL-HPR-A1" | "GLOBAL-HPR-A2" | "GLOBAL-HPR-A3"
        }
        localFiles: [
            {
                childImageSharp: {
                    gatsbyImageData: IGatsbyImageData
                }
            },
        ]
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
                    width: 660
                    quality: 99
                    layout: CONSTRAINED
                    placeholder: DOMINANT_COLOR
                )
                original {
                    src
                }
            }
        }
        mockup {
            childImageSharp {
                gatsbyImageData(
                    width: 660
                    quality: 99
                    layout: CONSTRAINED
                    placeholder: DOMINANT_COLOR
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
            }
            localFiles {
                childImageSharp {
                    gatsbyImageData(
                        width: 660
                        quality: 99
                        layout: CONSTRAINED
                        placeholder: DOMINANT_COLOR
                    )
                }
            }
        }
    }
`
