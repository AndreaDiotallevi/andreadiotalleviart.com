import React from "react"
import { graphql, PageProps } from "gatsby"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"

import Layout from "./layout"
import Seo from "../components/seo"
import PageTitle from "../components/pageTitle"

import * as artworkStyles from "./artwork.module.scss"

type DataProps = {
    artworksJson: {
        name: string
        description: string
        images: [
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

const Artwork = ({ data: { artworksJson } }: PageProps<DataProps>) => {
    return (
        <Layout>
            <React.Fragment>
                <Seo
                    title={`${artworksJson.name} | Andrea Diotallevi`}
                    description={artworksJson.description}
                    image={artworksJson.images[0].childImageSharp.fixed.src}
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
                    <PageTitle isHome={false} text={artworksJson.name} />
                    <div className={artworkStyles.container}>
                        <div>
                            <ul>
                                {artworksJson.images.map((image, index) => (
                                    <li key={index}>
                                        <GatsbyImage
                                            image={
                                                image.childImageSharp
                                                    .gatsbyImageData
                                            }
                                            alt={`${artworksJson.name}-${index}`}
                                        />
                                    </li>
                                ))}
                            </ul>
                            <div>
                                <p>{artworksJson.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        </Layout>
    )
}

export default Artwork

export const query = graphql`
    query($slug: String!) {
        artworksJson(slug: { eq: $slug }) {
            name
            description
            images {
                childImageSharp {
                    gatsbyImageData(
                        width: 660
                        quality: 100
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
