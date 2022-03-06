import React from "react"
import { graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"

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
                    gatsbyImageData(
                        width: 660
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

const Artwork = props => {
    return (
        <Layout>
            <Seo
                title={`${props.data.artworksJson.name} | Andrea Diotallevi`}
                description={props.data.artworksJson.description}
                image={
                    props.data.artworksJson.images[0].childImageSharp
                        .gatsbyImageData.src
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
                                        <GatsbyImage
                                            image={
                                                image.childImageSharp
                                                    .gatsbyImageData
                                            }
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
