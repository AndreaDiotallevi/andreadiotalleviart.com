import React from "react"
import { Link } from "gatsby"
import { graphql, PageProps } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"

import Layout from "../templates/layout"
import { StripePrice } from "../models/stripe"

import PageTitle from "../components/pageTitle"
import Seo from "../components/seo"
import * as styles from "./shop.module.scss"

type DataProps = {
    portaitPrints: {
        group: {
            edges: [{ node: StripePrice }]
        }[]
    }
    landscapePrints: {
        group: {
            edges: [{ node: StripePrice }]
        }[]
    }
}

const Shop = ({
    data: { portaitPrints, landscapePrints },
}: PageProps<DataProps>) => {
    return (
        <Layout>
            <div className={styles.container}>
                <h1 className={styles.h1}>Shop</h1>
                <PageTitle p="Archival quality giclée generative art prints, on vegan certified Hahnemühle photo rag 308gsm matte paper, delivered in less than 4 days" />
                <div className={styles.grid}>
                    {portaitPrints.group
                        .concat(landscapePrints.group)
                        .sort(
                            (a, b) =>
                                a.edges[0].node.product.metadata.displayOrder -
                                b.edges[0].node.product.metadata.displayOrder,
                        )
                        .map(group => (
                            <li
                                key={group.edges[0].node.product.metadata.slug}
                                className={`${styles.gridItem} ${group.edges[0].node.product.metadata.orientation === "landscape" ? styles.fullWidth : ""}`}
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
                                        {
                                            group.edges[0].node.product.metadata
                                                .displayName
                                        }
                                    </h2>
                                    <p>
                                        {group.edges.length > 1 ? "From " : ""}£
                                        {(
                                            group.edges.sort(
                                                (a, b) =>
                                                    a.node.unit_amount -
                                                    b.node.unit_amount,
                                            )[0].node.unit_amount / 100
                                        ).toFixed(2)}
                                    </p>
                                    <p>
                                        Sizes:{" "}
                                        {group.edges
                                            .map(
                                                edge =>
                                                    edge.node.product.metadata
                                                        .size,
                                            )
                                            .join(", ")}
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
        portaitPrints: allStripePrice(
            filter: {
                active: { eq: true }
                product: {
                    active: { eq: true }
                    metadata: { orientation: { eq: "portrait" } }
                }
            }
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
        landscapePrints: allStripePrice(
            filter: {
                active: { eq: true }
                product: {
                    active: { eq: true }
                    metadata: { orientation: { eq: "landscape" } }
                }
            }
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

export const Head = ({ data: { portaitPrints } }: PageProps<DataProps>) => (
    <Seo
        title="Shop | Giclée Fine Art Prints | Andrea Diotallevi"
        description="Archival quality giclée generative art prints, on vegan certified Hahnemühle photo rag 308gsm matte paper, delivered in less than 4 days."
        image={
            portaitPrints.group[0].edges[0].node.mockup.childImageSharp.original
                .src
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
