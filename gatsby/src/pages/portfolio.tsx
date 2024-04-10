import React from "react"
import { Link } from "gatsby"
import { graphql, PageProps } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"

import Layout from "../templates/layout"
import { Artwork } from "../models/artworks"

import Seo from "../components/seo"
import * as styles from "./portfolio.module.scss"

type DataProps = {
    allArtworksJson: {
        edges: [{ node: Artwork }]
    }
}

const Portfolio = ({ data: { allArtworksJson } }: PageProps<DataProps>) => {
    return (
        <Layout>
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
                    ...ArtworkFragment
                }
            }
        }
    }
`

export const Head = () => (
    <Seo
        title="Portfolio | Andrea Diotallevi Art"
        description="The artwork of Andrea Diotallevi, a practising generative artist, creative coder, software engineer, architect and pianist"
        tags={[
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
        ]}
        isMenuOpen={false}
    />
)
