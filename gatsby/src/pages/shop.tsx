import React from "react"
import { Link } from "gatsby"
import { graphql, PageProps } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"

import Layout from "../templates/layout"
import { StripePrice } from "../models/stripe"

import Seo from "../components/seo"
import * as styles from "./shop.module.scss"

type DataProps = {
    allStripePrice: {
        edges: [{ node: StripePrice }]
    }
}

const Shop = ({ data: { allStripePrice } }: PageProps<DataProps>) => {
    const getStripePrice = (slug: string) => {
        return allStripePrice.edges.filter(
            edge => edge.node.product.metadata.slug === slug,
        )[0]
    }

    return (
        <Layout>
            <div className={styles.container}>
                <h1 className={styles.h1}>Prints</h1>
                <div className={styles.grid}>
                    {allStripePrice.edges.map(({ node }) => (
                        <li
                            key={node.product.metadata.slug}
                            className={styles.gridItem}
                        >
                            <Link
                                to={`/shop/prints/${node.product.metadata.slug}`}
                            >
                                <GatsbyImage
                                    alt="image"
                                    image={
                                        node.mockup.childImageSharp
                                            .gatsbyImageData
                                    }
                                />
                                <h2>{node.product.name}</h2>
                                <p>
                                    £
                                    {(
                                        getStripePrice(
                                            node.product.metadata.slug,
                                        ).node.unit_amount / 100
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
    }
`

export const Head = ({ data: { allStripePrice } }: PageProps<DataProps>) => (
    <Seo
        title="Shop | Andrea Diotallevi"
        description="Discover the beauty of generative art with our high-quality fine art prints. Each piece uniquely combines technology and creativity, perfect for discerning collectors."
        image={allStripePrice.edges[0].node.mockup.childImageSharp.fixed.src}
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
    />
)
