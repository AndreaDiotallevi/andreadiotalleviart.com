import React from "react"
import { graphql } from "gatsby"

import Layout from "./layout"

export const query = graphql`
    query ($slug: String!) {
        artworksJson ( slug: { eq: $slug }) {
            name
            images {
                childImageSharp {
                    fluid(maxWidth: 310) {
                        ...GatsbyImageSharpFluid
                    }
                }
            }
        }
    }
`

const Artwork = (props) => {
    return (
        <Layout>
            {props.data.artworksJson.name}
        </Layout>
    )
}

export default Artwork
