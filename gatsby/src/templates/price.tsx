import React, { useState } from "react"
import { graphql, PageProps, Link, navigate } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"

import Layout from "./layout"

import Button from "../components/button" // Needs to be below Layout
import Seo from "../components/seo"

import { StripePrice } from "../models/stripe"

import { createCheckoutSession } from "../api"
import { sendGA4BeginCheckoutEvent } from "../services/ga4"

import * as styles from "./showcase.module.scss"
import InputSelect from "../components/inputSelect"

type DataProps = {
    allStripePrice: { edges: [{ node: StripePrice }] }
}

const PricePage = ({
    data: { allStripePrice },
    location,
}: PageProps<DataProps>) => {
    const [loading, setLoading] = useState(false)
    const [slideShowIndex, setSliderShowIndex] = useState(0)

    const params = new URLSearchParams(location.search)
    const size = params.get("size")

    const selectedPrice =
        allStripePrice.edges.find(
            price => price.node.product.metadata.size === size,
        )?.node || allStripePrice.edges[0].node

    const images = [selectedPrice.mockup, selectedPrice.artwork]

    const sizeToDescription: Record<
        StripePrice["product"]["metadata"]["size"],
        string
    > = {
        A3: "A3 (297 x 420 mm)",
        A2: "A2 (420 x 594 mm)",
        A1: "A1 (594 x 841 mm)",
    }

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.linksContainer}>
                    <Link to="/shop" className={styles.backButtonContainer}>
                        <div className={styles.backButtonIcon} />
                        <p className={styles.linkText}>Back to shop</p>
                    </Link>
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
                        <h1 className={styles.h1}>
                            {selectedPrice.product.metadata.displayName}
                        </h1>
                        <h2>Size</h2>
                        <InputSelect
                            name="size"
                            onChange={event => {
                                event.preventDefault()
                                navigate(`?size=${event.target.value}`)
                            }}
                            options={allStripePrice.edges.map(edge => ({
                                key: edge.node.id,
                                value: edge.node.product.metadata.size,
                                display: `${
                                    sizeToDescription[
                                        edge.node.product.metadata.size
                                    ]
                                } - £${(edge.node.unit_amount / 100).toFixed(
                                    2,
                                )}`,
                            }))}
                            defaultValue={selectedPrice.product.metadata.size}
                        />
                        <p>The image is printed full bleed with no border.</p>
                        {/* <h2>Hahnemühle photo rag 308gsm</h2> */}
                        <h2>100% cotton paper</h2>
                        <p>
                            The artwork is printed on a white cotton paper
                            called Hahnemühle photo rag 308gsm. With its
                            characteristic, wonderfully soft feel, it boasts a
                            lightly defined felt structure, lending each artwork
                            a three-dimensional appearance and impressive
                            pictorial depth.
                            {/* The white cotton artist's paper, with its
                            characteristic, wonderfully soft feel, boasts a
                            lightly defined felt structure, lending each artwork
                            a three-dimensional appearance and impressive
                            pictorial depth. A heavy-duty, vegan certified matte
                            paper made of 100% cotton rag with a natural white
                            tone and excellent black saturation. It has a soft
                            texture with a lightly defined felt structure. */}
                        </p>
                        <h2>Premium print quality</h2>
                        <p>
                            The print is crafted using premium, pigment-based
                            inks that are fade-resistant and can endure for up
                            to 200 years. This technique, called Giclée, makes
                            the print stand apart with its extremely high level
                            of quality, longevity and value compared to a
                            standard print.
                            {/* Giclée is a printing technique which involves
                            spraying microscopic pigments onto high-quality
                            paper to reproduce artwork for print or display.
                            When used in conjunction with high-grade paper,
                            giclée printing achieves archival quality, creating
                            prints that last well over 100 years. */}
                        </p>
                        <h2>Free shipping</h2>
                        <p>
                            Shipping is handled by theprintspace in London
                            through First Class Tracked Mail (typically 6-10
                            days). This is an extremely more secure option than
                            regular post for sending art prints.
                        </p>
                        <h2>No custom charges for UK-EU-US orders</h2>
                        <p>
                            With production in the UK, USA & Germany,
                            theprintspace guarantees no extra customs charges on
                            UK-EU-US orders.
                        </p>
                        <h2>£{(selectedPrice.unit_amount / 100).toFixed(2)}</h2>
                        <p>Apply promotion codes at checkout.</p>
                        <Button
                            role="link"
                            loading={loading}
                            onClick={async () => {
                                setLoading(true)
                                const data = await createCheckoutSession({
                                    line_items: [
                                        {
                                            price: selectedPrice.id,
                                            quantity: 1,
                                        },
                                    ],
                                    success_url: `${location.origin}/shop/checkout/success`,
                                })

                                if (!data) {
                                    console.error("Session failed to create")
                                    setLoading(false)
                                    return
                                }

                                sendGA4BeginCheckoutEvent({
                                    session: data.session,
                                })

                                navigate(
                                    `/shop/checkout?clientSecret=${data.session.client_secret}`,
                                )
                            }}
                        >
                            Continue to checkout
                        </Button>
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
        title={`${allStripePrice.edges[0].node.product.metadata.displayName} | Giclée Fine Art Print | Andrea Diotallevi Art`}
        description={allStripePrice.edges[0].node.product.description}
        image={allStripePrice.edges[0].node.mockup.childImageSharp.original.src}
        type="product"
        tags={[
            allStripePrice.edges[0].node.product.name,
            "Generative Art",
            "p5.js",
            "Processing",
            "Procedural",
            "Prints",
            "Fine Art",
            "Giclee",
            "Hahnemühle photo rag",
        ]}
        amount={(allStripePrice.edges[0].node.unit_amount / 100).toFixed(2)}
    />
)
