import { graphql } from "gatsby"
import { IGatsbyImageData } from "gatsby-plugin-image"

export type Print = {
    id: string
    name: string
    slug: string
    images: [
        {
            id: string
            childImageSharp: {
                gatsbyImageData: IGatsbyImageData
            }
        }
    ]
}

export const query = graphql`
    fragment PrintFragment on PrintsJson {
        id
        name
        slug
        images {
            id
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
