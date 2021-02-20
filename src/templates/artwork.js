import React from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"

import Layout from "./layout"

import artworkStyles from "./artwork.module.scss"

export const query = graphql`
    query ($slug: String!) {
        artworksJson ( slug: { eq: $slug }) {
            name
            description
            images {
                childImageSharp {
                    fluid(maxWidth: 660) {
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
            <div className={artworkStyles.container}>
                <div>
                    <ul>
                        {props.data.artworksJson.images.map((image, index) => (
                            <li key={index}>
                                <Img fluid={image.childImageSharp.fluid} />
                            </li>
                        ))}
                    </ul>
                    <div>
                        <h3>{props.data.artworksJson.name}</h3>
                        <p>{props.data.artworksJson.description}</p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Artwork
