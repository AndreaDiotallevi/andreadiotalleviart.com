import { graphql } from "gatsby"
import { IGatsbyImageData } from "gatsby-plugin-image"

export type Artwork = {
    id: string
    name: string
    description: string
    slug: string
    images: [
        {
            id: string
            childImageSharp: {
                gatsbyImageData: IGatsbyImageData
                original: {
                    src: string
                }
            }
        },
    ]
}

export const query = graphql`
    fragment ArtworkFragment on ArtworksJson {
        id
        name
        description
        slug
        images {
            id
            childImageSharp {
                gatsbyImageData(
                    width: 750
                    quality: 99
                    layout: CONSTRAINED
                    placeholder: BLURRED
                )
                original {
                    src
                }
            }
        }
    }
`
