import { graphql } from "gatsby"
import { IGatsbyImageData } from "gatsby-plugin-image"

export type Print = {
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
        slug
        images {
            childImageSharp {
                gatsbyImageData
            }
        }
    }
`
