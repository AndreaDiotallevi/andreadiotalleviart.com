import React from "react"
import { Link } from "gatsby"
import { graphql, PageProps } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"

import Layout from "../templates/layout"
import { Artwork } from "../models/artworks"

import PageTitle from "../components/pageTitle"
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
                <h1 className={styles.h1}>Portfolio</h1>
                <PageTitle p="Experimentations with generative art patterns and algorithms as a dynamic dialogue between human creativity and computer efficiency" />
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

export const Head = ({ data: { allArtworksJson } }: PageProps<DataProps>) => (
    <Seo
        title="Portfolio | Andrea Diotallevi Art"
        description="Experimentations with generative art patterns and algorithms as a dynamic dialogue between human creativity and computer efficiency."
        image={
            allArtworksJson.edges[0].node.images[0].childImageSharp.original.src
        }
        tags={[
            "Generative Art",
            "Album Covers",
            "p5.js",
            "Processing",
            "Procedural",
        ]}
    />
)
