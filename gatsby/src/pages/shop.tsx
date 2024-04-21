import React from "react"
import { Link } from "gatsby"
import { graphql, PageProps } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"

import Layout from "../templates/layout"
import { StripePrice } from "../models/stripe"
import { getProductNameFromSlug } from "../utils/getProductNameFromSlug"

import Seo from "../components/seo"
import * as styles from "./shop.module.scss"

type DataProps = {
    allStripePrice: {
        group: {
            edges: [{ node: StripePrice }]
        }[]
    }
}

const Shop = ({ data: { allStripePrice } }: PageProps<DataProps>) => {
    return (
        <Layout>
            <div className={styles.container}>
                <h1 className={styles.h1}>Giclée Fine Art Prints</h1>
                <div className={styles.grid}>
                    {allStripePrice.group.map(group => (
                        <li
                            key={group.edges[0].node.product.metadata.slug}
                            className={styles.gridItem}
                        >
                            <Link
                                to={`/shop/prints/${group.edges[0].node.product.metadata.slug}`}
                            >
                                <GatsbyImage
                                    alt="image"
                                    image={
                                        group.edges[0].node.mockup
                                            .childImageSharp.gatsbyImageData
                                    }
                                />
                                <h2>
                                    {getProductNameFromSlug(
                                        group.edges[0].node.product.metadata
                                            .slug,
                                    )}
                                </h2>
                                <p>
                                    {group.edges.length > 1 ? "from " : ""}£
                                    {(
                                        group.edges[0].node.unit_amount / 100
                                    ).toFixed(2)}
                                </p>
                                {/* <p className={styles.note}>
                                    available in A3, A2 and A1
                                </p> */}
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
            sort: { product: { metadata: { size: DESC } } }
        ) {
            group(field: { product: { metadata: { slug: SELECT } } }) {
                edges {
                    node {
                        ...StripePriceFragment
                    }
                }
            }
        }
    }
`

export const Head = ({ data: { allStripePrice } }: PageProps<DataProps>) => (
    <Seo
        title="Shop | Giclée Fine Art Prints | Andrea Diotallevi"
        description="Discover the beauty of generative art with our high-quality fine art prints. Each piece uniquely combines technology and creativity, perfect for discerning collectors."
        image={
            allStripePrice.group[0].edges[0].node.mockup.childImageSharp
                .original.src
        }
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
