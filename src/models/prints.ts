import { graphql } from "gatsby"
import { IGatsbyImageData } from "gatsby-plugin-image"

export type Print = {
    name: string
    slug: string
    images: [
        {
            childImageSharp: {
                gatsbyImageData: IGatsbyImageData
            }
        }
    ]
}

export const query = graphql`
    fragment PrintFragment on PrintsJson {
        name
        slug
        images {
            childImageSharp {
                gatsbyImageData(
                    width: 660
                    quality: 99
                    layout: CONSTRAINED
                    placeholder: BLURRED
                )
            }
        }
    }
`
