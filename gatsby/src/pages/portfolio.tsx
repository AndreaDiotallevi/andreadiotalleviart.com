import React from "react"
import { Link } from "gatsby"
import { graphql, PageProps } from "gatsby"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"

import Layout from "../templates/layout"
import PageTitle from "../components/pageTitle"

import * as portfolioStyles from "./portfolio.module.scss"

type DataProps = {
    allArtworksJson: {
        edges: [
            {
                node: {
                    slug: string
                    name: string
                    images: [
                        {
                            childImageSharp: {
                                gatsbyImageData: IGatsbyImageData
                            }
                        }
                    ]
                }
            }
        ]
    }
}

const Portfolio = ({ data: { allArtworksJson } }: PageProps<DataProps>) => {
    return (
        <Layout
            seo={{
                title: "Portfolio | Andrea Diotallevi",
                description:
                    "The artwork of Andrea Diotallevi, a practising generative artist, creative coder, software engineer, architect and pianist",
                tags: [
                    "Andrea Diotallevi",
                    "Andrea Diotallevi Art",
                    "Generative Art",
                    "Album Covers",
                    "NFTs",
                    "p5.js",
                    "Processing",
                    "Procedural",
                    "Print",
                    "Giclee",
                ],
            }}
        >
            <React.Fragment>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%",
                        marginBottom: "50px",
                    }}
                >
                    <PageTitle isHome={false} text="Generative Art" />
                    <div>
                        <ul className={portfolioStyles.container}>
                            {allArtworksJson.edges.map(({ node }) => (
                                <li key={node.name}>
                                    <Link to={`/portfolio/${node.slug}`}>
                                        <GatsbyImage
                                            image={
                                                node.images[0].childImageSharp
                                                    .gatsbyImageData
                                            }
                                            alt={node.name}
                                        />
                                        <h2>{node.name}</h2>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </React.Fragment>
        </Layout>
    )
}

export default Portfolio

export const query = graphql`
    {
        allArtworksJson {
            edges {
                node {
                    slug
                    name
                    images {
                        childImageSharp {
                            gatsbyImageData(
                                width: 310
                                quality: 99
                                layout: CONSTRAINED
                                placeholder: BLURRED
                            )
                        }
                    }
                }
            }
        }
    }
`
