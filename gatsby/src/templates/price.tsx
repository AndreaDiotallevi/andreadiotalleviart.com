import React, { useEffect, useState } from "react"
import { graphql, PageProps, Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"

import Seo from "../components/seo"
import Layout from "./layout"
import { StripePrice } from "../models/stripe"

import * as styles from "./showcase.module.scss"
import { createCheckoutSession } from "../api"

type DataProps = {
    stripePrice: StripePrice
}

const PricePage = ({
    data: { stripePrice },
    location,
}: PageProps<DataProps>) => {
    const [clientSecret, setClientSecret] = useState<string | null>(null)
    const [slideShowIndex, setSliderShowIndex] = useState(0)

    const images = [stripePrice.mockup, stripePrice.artwork]

    useEffect(() => {
        const createSession = async () => {
            const data = await createCheckoutSession({
                line_items: [{ price: stripePrice.id, quantity: 1 }],
                success_url: location.origin,
            })

            if (!data) return

            setClientSecret(data.session.client_secret)
        }

        createSession()
    }, [])

    return (
        <Layout>
            <div className={styles.container}>
                <h1 className={styles.h1}>{stripePrice.product.name}</h1>
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
                        <p>{stripePrice.product.description}</p>
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
                            You should receive your order within 24-48 hours.
                            Shipping costs included.
                        </p>
                        <h2>£{(stripePrice.unit_amount / 100).toFixed(2)}</h2>
                        <p>Apply promotion codes at checkout.</p>
                        <Link
                            to={
                                clientSecret
                                    ? `/checkout?clientSecret=${clientSecret}`
                                    : ""
                            }
                            className={styles.button}
                        >
                            Buy Now
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default PricePage

export const query = graphql`
    query ($slug: String!) {
        stripePrice(product: { metadata: { slug: { eq: $slug } } }) {
            ...StripePriceFragment
        }
    }
`

export const Head = ({ data: { stripePrice } }: PageProps<DataProps>) => (
    <Seo
        title={`${stripePrice.product.name} | Giclée Fine Art Print | Andrea Diotallevi`}
        description={stripePrice.product.description}
        image={stripePrice.mockup.childImageSharp.original.src}
        type="product"
        tags={[
            stripePrice.product.name,
            "Generative Art",
            "p5.js",
            "Processing",
            "Procedural",
            "Print",
            "Giclee",
        ]}
    />
)
