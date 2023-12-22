import React from "react"
import { Link } from "gatsby"
import { graphql, PageProps } from "gatsby"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"

import Layout from "../templates/layout"
import PageTitle from "../components/pageTitle"
import { StripePrice } from "../models/stripe"

import * as shopStyles from "./shop.module.scss"

type DataProps = {
    allStripePrice: {
        edges: [{ node: StripePrice }]
    }
    allPrintsJson: {
        edges: [
            {
                node: {
                    slug: string
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

const Shop = ({
    data: { allStripePrice, allPrintsJson },
}: PageProps<DataProps>) => {
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
                    <PageTitle isHome={false} text="" />
                    <p className={shopStyles.fixed}>Prints</p>
                    <div>
                        <ul className={shopStyles.container}>
                            {allStripePrice.edges.map(({ node }) => (
                                <li key={node.id}>
                                    <Link
                                        to={`/shop/${node.product.metadata.slug}`}
                                    >
                                        <GatsbyImage
                                            image={
                                                allPrintsJson.edges.filter(
                                                    edge =>
                                                        edge.node.slug ===
                                                        node.product.metadata
                                                            .slug
                                                )[0].node.images[0]
                                                    .childImageSharp
                                                    .gatsbyImageData
                                            }
                                            // image={
                                            //     allPrintsJson.edges[0].node
                                            //         .images[0].childImageSharp
                                            //         .gatsbyImageData
                                            // }

                                            // image={
                                            //     node.product.localFiles[0]
                                            //         .childImageSharp
                                            //         .gatsbyImageData
                                            // }
                                            alt={node.product.name}
                                        />
                                        <h2>{node.product.name}</h2>
                                        <p>
                                            £
                                            {(node.unit_amount / 100).toFixed(
                                                2
                                            )}
                                        </p>
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

export default Shop

export const query = graphql`
    {
        allStripePrice(filter: { active: { eq: true } }) {
            edges {
                node {
                    ...StripePriceFragment
                }
            }
        }
        allPrintsJson {
            edges {
                node {
                    slug
                    images {
                        childImageSharp {
                            gatsbyImageData
                        }
                    }
                }
            }
        }
    }
`
