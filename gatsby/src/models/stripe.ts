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
        }
    }
    mockup: {
        childImageSharp: {
            gatsbyImageData: IGatsbyImageData
        }
    }
    product: {
        id: string
        name: string
        description: string
        metadata: {
            category: "prints"
            slug: "marble-lake" | "flames"
            size: "a2" | "a3"
        }
        localFiles: [
            {
                childImageSharp: {
                    gatsbyImageData: IGatsbyImageData
                    fixed: {
                        src: string
                    }
                }
            }
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
                    placeholder: BLURRED
                )
            }
        }
        mockup {
            childImageSharp {
                gatsbyImageData(
                    width: 660
                    quality: 99
                    layout: CONSTRAINED
                    placeholder: BLURRED
                )
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
            }
            localFiles {
                childImageSharp {
                    gatsbyImageData(
                        width: 660
                        quality: 99
                        layout: CONSTRAINED
                        placeholder: BLURRED
                    )
                    fixed {
                        src
                    }
                }
            }
        }
    }
`
