import { graphql } from "gatsby"
import { IGatsbyImageData } from "gatsby-plugin-image"

export type StripePrice = {
    id: string
    active: boolean
    currency: string
    unit_amount: number
    product: {
        id: string
        name: string
        description: string
        metadata: {
            slug: string
            medium: string
            dimensions: string
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
        product {
            id
            name
            description
            metadata {
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
