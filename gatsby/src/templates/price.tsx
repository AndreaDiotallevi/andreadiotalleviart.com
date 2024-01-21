import React, { useEffect, useState } from "react"
import { graphql, PageProps, Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"

import Layout from "./layout"
import { StripePrice } from "../models/stripe"
import { Print } from "../models/prints"
import getStripe from "../utils/stripejs"

import * as styles from "./price.module.scss"
import { createCheckoutSession } from "../api"

type DataProps = {
    stripePrice: StripePrice
    printsJson: Print
}

const Price = ({ data: { stripePrice, printsJson } }: PageProps<DataProps>) => {
    // const [loading, setLoading] = useState(false)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [slideShowIndex, setSliderShowIndex] = useState(0)

    useEffect(() => {
        const createSession = async () => {
            const sessionId = await createCheckoutSession({
                line_items: [{ price: stripePrice.id, quantity: 1 }],
                success_url: window.location.origin,
                cancel_url: window.location.href,
            })
            setSessionId(sessionId)
        }

        createSession()
    }, [])

    const redirectToCheckout = async () => {
        // setLoading(true)

        const stripe = await getStripe()

        if (!stripe || !sessionId) return

        stripe.redirectToCheckout({ sessionId })
    }

    return (
        <Layout
            seo={{
                title: `${stripePrice.product.name} | Andrea Diotallevi`,
                description: stripePrice.product.description,
                tags: [
                    stripePrice.product.name,
                    "Generative Art",
                    "p5.js",
                    "Processing",
                    "Procedural",
                    "Print",
                    "Giclee",
                ],
            }}
        >
            <div className={styles.container}>
                <h1 className={styles.h1}>{stripePrice.product.name}</h1>
                <Link to="/shop" className={styles.backButtonContainer}>
                    <div className={styles.backButtonIcon} />
                    <p className={styles.backButtonText}>Shop</p>
                </Link>
                <div className={styles.grid}>
                    <div className={styles.gridItem1}>
                        <div>
                            <GatsbyImage
                                alt={printsJson.images[slideShowIndex].id}
                                image={
                                    printsJson.images[slideShowIndex]
                                        .childImageSharp.gatsbyImageData
                                }
                            />
                        </div>
                        <ul className={styles.imageList}>
                            {printsJson.images.map((image, index) => (
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
                                        alt={printsJson.images[index].id}
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
                        <p>
                            Fine art archival giclée print on Hahnemühle Photo
                            Rag at 308gsm with subtle fibrous finish.
                        </p>
                        <p>
                            Paper dimensions: 22 x 27.25 in (56 x 69.25 cm).
                            <br></br>Image dimensions: 21 x 26.25 in (35.25 x
                            66.75 cm).
                        </p>
                        <p style={{ marginBottom: 48 }}>
                            Print purchases are posted with a certificate of
                            authenticity that includes the artist’s signature,
                            edition number, size and paper stock.
                        </p>
                        <h2>Shipping</h2>
                        <p>
                            The prints are sold unframed and packaged flat
                            between cardboard for protection.<br></br>All
                            shipping costs included.
                        </p>
                        <p style={{ marginBottom: 48 }}>
                            UK shipping can take 2-3 weeks to arrive.
                            International shipping take up to 4 weeks to arrive.
                            Read the full shipping and returns details here.
                        </p>
                        <h2>£{(stripePrice.unit_amount / 100).toFixed(2)}</h2>
                        <p>Apply promotions at checkout.</p>
                        <button
                            className={styles.button}
                            onClick={() => redirectToCheckout()}
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Price

export const query = graphql`
    query($slug: String!) {
        stripePrice(product: { metadata: { slug: { eq: $slug } } }) {
            ...StripePriceFragment
        }
        printsJson(slug: { eq: $slug }) {
            ...PrintFragment
        }
    }
`
