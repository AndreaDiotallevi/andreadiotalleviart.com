import React from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"

import Layout from "./layout"
import Seo from "../components/seo"
import PageTitle from "../components/pageTitle"

import * as artworkStyles from "./artwork.module.scss"

export const query = graphql`
    query($slug: String!) {
        artworksJson(slug: { eq: $slug }) {
            name
            description
            images {
                childImageSharp {
                    fluid(maxWidth: 660) {
                        ...GatsbyImageSharpFluid
                    }
                    fixed {
                        src
                    }
                }
            }
        }
    }
`

const Artwork = props => {
    return (
        <Layout>
            <Seo
                title={`${props.data.artworksJson.name} | Andrea Diotallevi`}
                description={props.data.artworksJson.description}
                image={
                    props.data.artworksJson.images[0].childImageSharp.fixed.src
                }
            />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    marginBottom: "50px",
                }}
            >
                <PageTitle isHome={false} text={props.data.artworksJson.name} />
                <div className={artworkStyles.container}>
                    <div>
                        <ul>
                            {props.data.artworksJson.images.map(
                                (image, index) => (
                                    <li key={index}>
                                        <Img
                                            fluid={image.childImageSharp.fluid}
                                            alt={`${props.data.artworksJson.name}-${index}`}
                                        />
                                    </li>
                                )
                            )}
                        </ul>
                        <div>
                            <p>{props.data.artworksJson.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Artwork
