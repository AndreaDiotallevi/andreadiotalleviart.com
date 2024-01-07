import React from "react"
import { Link } from "gatsby"
import { graphql, PageProps } from "gatsby"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"

import Layout from "../templates/layout"
import { StripePrice } from "../models/stripe"
import { Print } from "../models/prints"

import * as styles from "./shop.module.scss"

type DataProps = {
    allStripePrice: {
        edges: [{ node: StripePrice }]
    }
    allPrintsJson: {
        edges: [{ node: Print }]
    }
}

const Shop = ({
    data: { allStripePrice, allPrintsJson },
}: PageProps<DataProps>) => {
    const getStripePrice = (slug: string) => {
        return allStripePrice.edges.filter(
            edge => edge.node.product.metadata.slug === slug
        )[0]
    }

    return (
        <Layout
            seo={{
                title: "Shop | Andrea Diotallevi",
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
                <h1 className={styles.h1}>Prints</h1>
                <div className={styles.grid}>
                    {allPrintsJson.edges.map(({ node }) => (
                        <li key={node.slug} className={styles.gridItem}>
                            <Link to={`/shop/${node.slug}`}>
                                <GatsbyImage
                                    alt={node.images[0].id}
                                    image={
                                        node.images[0].childImageSharp
                                            .gatsbyImageData
                                    }
                                />
                                <h2>{node.name}</h2>
                                <p>
                                    £
                                    {(
                                        getStripePrice(node.slug).node
                                            .unit_amount / 100
                                    ).toFixed(2)}
                                </p>
                            </Link>
                        </li>
                    ))}
                </div>
            </div>
        </Layout>
    )
}

export default Shop

export const query = graphql`
    {
        allStripePrice(
            filter: { active: { eq: true }, product: { active: { eq: true } } }
        ) {
            edges {
                node {
                    ...StripePriceFragment
                }
            }
        }
        allPrintsJson {
            edges {
                node {
                    ...PrintFragment
                }
            }
        }
    }
`
