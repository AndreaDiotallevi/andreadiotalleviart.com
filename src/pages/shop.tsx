import React from "react"
import { Link } from "gatsby"
import { graphql, PageProps } from "gatsby"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"

import Layout from "../templates/layout"
import Seo from "../components/seo"
import PageTitle from "../components/pageTitle"
import { StripePrice } from "../models/stripe"

import * as portfolioStyles from "./shop.module.scss"

type DataProps = {
    allStripePrice: StripePrice[]
}

const Shop = ({ data: { allStripePrice } }: PageProps<DataProps>) => {
    return (
        <Layout>
            <React.Fragment>
                <Seo
                    title="Shop | Andrea Diotallevi"
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
                    <PageTitle isHome={false} text="Shop" />
                    <div>
                        <ul className={portfolioStyles.container}>
                            {allStripePrice.edges.map(({ node }) => (
                                <li key={node.id}>
                                    <Link
                                        to={`/shop/${node.product.metadata.slug}`}
                                    >
                                        <GatsbyImage
                                            image={
                                                node.product.localFiles[0]
                                                    .childImageSharp
                                                    .gatsbyImageData
                                            }
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
        allStripePrice {
            edges {
                node {
                    ...StripePriceFragment
                }
            }
        }
    }
`
