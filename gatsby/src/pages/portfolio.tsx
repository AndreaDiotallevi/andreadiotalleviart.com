import React from "react"
import { Link } from "gatsby"
import { graphql, PageProps } from "gatsby"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"

import Layout from "../templates/layout"

import * as styles from "./portfolio.module.scss"

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
            <div className={styles.container}>
                <h1 className={styles.h1}>Generative Art</h1>
                <div className={styles.grid}>
                    {allArtworksJson.edges.map(({ node }) => (
                        <li key={node.slug} className={styles.gridItem}>
                            <Link to={`/portfolio/${node.slug}`}>
                                <GatsbyImage
                                    alt={node.name}
                                    image={
                                        node.images[0].childImageSharp
                                            .gatsbyImageData
                                    }
                                />
                                <h2>{node.name}</h2>
                            </Link>
                        </li>
                    ))}
                </div>
            </div>
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
