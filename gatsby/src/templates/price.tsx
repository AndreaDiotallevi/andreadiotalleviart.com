import React, { useState } from "react"
import { graphql, PageProps, Link, navigate } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"

import Seo from "../components/seo"
import Layout from "./layout"
import { StripePrice } from "../models/stripe"

import * as styles from "./showcase.module.scss"
import { createCheckoutSession } from "../api"

type DataProps = {
    allStripePrice: { edges: [{ node: StripePrice }] }
}

const PricePage = ({
    data: { allStripePrice },
    location,
}: PageProps<DataProps>) => {
    const [loading, setLoading] = useState(false)
    const [slideShowIndex, setSliderShowIndex] = useState(0)
    const [selectedPriceId, setSelectedPriceId] = useState(
        allStripePrice.edges[0].node.id,
    )
    const selectedPrice = allStripePrice.edges.filter(
        edge => edge.node.id === selectedPriceId,
    )[0].node

    const images = [selectedPrice.mockup, selectedPrice.artwork]

    return (
        <Layout loading={loading}>
            <div className={styles.container}>
                <h1 className={styles.h1}>{selectedPrice.product.name}</h1>
                <div className={styles.linksContainer}>
                    <div />
                    <Link to="/shop" className={styles.backButtonContainer}>
                        <div className={styles.backButtonIcon} />
                        <p className={styles.linkText}>Back to Shop</p>
                    </Link>
                    <div />
                    <div />
                </div>
                <div className={styles.grid}>
                    <div className={styles.gridItem1}>
                        <div
                            className={styles.mainImage}
                            onClick={() =>
                                setSliderShowIndex((slideShowIndex + 1) % 2)
                            }
                        >
                            <GatsbyImage
                                onClick={() =>
                                    setSliderShowIndex((slideShowIndex + 1) % 2)
                                }
                                alt={"image"}
                                image={
                                    images[slideShowIndex].childImageSharp
                                        .gatsbyImageData
                                }
                            />
                        </div>
                        <ul className={styles.imageList}>
                            {images.map((image, index) => (
                                <li
                                    key={`image-${index}`}
                                    onClick={() => setSliderShowIndex(index)}
                                    className={`${styles.imageListItem} ${
                                        slideShowIndex === index
                                            ? styles.active
                                            : ""
                                    }`}
                                >
                                    <GatsbyImage
                                        alt={"image"}
                                        image={
                                            image.childImageSharp
                                                .gatsbyImageData
                                        }
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.gridItem2}>
                        <h2>Description</h2>
                        <p>{selectedPrice.product.description}</p>
                        <p>
                            Prints are only touched with paper-handling gloves,
                            each is wrapped in paper before being placed in a
                            shipping tube for delivery.
                        </p>
                        <p>
                            All prints come with a white border for framing.
                            Framing not included.
                        </p>
                        <p>
                            Free express shipping, delivered within 24-48 hours.
                        </p>
                        <p>Apply promotion codes at checkout.</p>
                        <h2>£{(selectedPrice.unit_amount / 100).toFixed(2)}</h2>
                        {allStripePrice.edges.length > 1 ? (
                            <select
                                className={styles.select}
                                onChange={event => {
                                    event.preventDefault()
                                    setSelectedPriceId(event.target.value)
                                }}
                            >
                                {allStripePrice.edges.map(edge => (
                                    <option
                                        key={edge.node.id}
                                        value={edge.node.id}
                                    >
                                        {edge.node.product.metadata.size} - £
                                        {(edge.node.unit_amount / 100).toFixed(
                                            2,
                                        )}
                                        {/* A3 297 x 420 mm (11.7 x 16.5 inches) -
                                    £110,00 */}
                                    </option>
                                ))}
                            </select>
                        ) : null}
                        <div
                            role="link"
                            className={styles.button}
                            onClick={async () => {
                                setLoading(true)
                                const data = await createCheckoutSession({
                                    line_items: [
                                        {
                                            price: selectedPrice.id,
                                            quantity: 1,
                                        },
                                    ],
                                    success_url: location.origin,
                                })

                                if (!data) {
                                    console.error("Session failed to create")
                                    setLoading(false)
                                    return
                                }

                                navigate(
                                    `/checkout?clientSecret=${data.session.client_secret}`,
                                )
                            }}
                        >
                            Buy Now
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default PricePage

export const query = graphql`
    query ($slug: String!) {
        allStripePrice(
            filter: {
                active: { eq: true }
                product: { metadata: { slug: { eq: $slug } } }
            }
            sort: { product: { metadata: { size: DESC } } }
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
        title={`${allStripePrice.edges[0].node.product.metadata.slug
            .split("-")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")} | Giclée Fine Art Prints | Andrea Diotallevi`}
        description={allStripePrice.edges[0].node.product.description}
        image={allStripePrice.edges[0].node.mockup.childImageSharp.original.src}
        type="product"
        tags={[
            allStripePrice.edges[0].node.product.name,
            "Generative Art",
            "p5.js",
            "Processing",
            "Procedural",
            "Print",
            "Giclee",
        ]}
        amount={(allStripePrice.edges[0].node.unit_amount / 100).toFixed(2)}
    />
)
