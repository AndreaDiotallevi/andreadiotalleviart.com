import React, { useState } from "react"
import { graphql, PageProps } from "gatsby"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"

import Layout from "./layout"
import Seo from "../components/seo"
import PageTitle from "../components/pageTitle"
import { StripePrice } from "../models/stripe"
import { countryCodes } from "../utils/countryCodes"
import getStripe from "../utils/stripejs"

import * as artworkStyles from "./price.module.scss"

type DataProps = {
    stripePrice: StripePrice
    allPrintsJson: {
        edges: [
            {
                node: {
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

const Price = ({
    data: { stripePrice, allPrintsJson },
}: PageProps<DataProps>) => {
    const [loading, setLoading] = useState(false)
    const [slideShowIndex, setSliderShowIndex] = useState(0)

    const redirectToCheckout = async () => {
        setLoading(true)

        const priceId = stripePrice.id
        const stripe = await getStripe()

        if (!stripe) return

        const { error } = await stripe.redirectToCheckout({
            mode: "payment",
            lineItems: [{ price: priceId, quantity: 1 }],
            successUrl: `${window.location.origin}/shop`,
            cancelUrl: `${window.location.origin}/shop`,
            shippingAddressCollection: { allowedCountries: countryCodes },
        })

        if (error) {
            console.warn("Error:", error)
            setLoading(false)
        }
    }

    const images = allPrintsJson.edges[0].node.images

    return (
        <Layout>
            <React.Fragment>
                <Seo
                    title={`${stripePrice.product.name} | Andrea Diotallevi`}
                    description={stripePrice.product.description}
                    image={
                        stripePrice.product.localFiles[0].childImageSharp.fixed
                            .src
                    }
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
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%",
                        marginBottom: "50px",
                    }}
                >
                    <PageTitle isHome={false} text={stripePrice.product.name} />
                    <div className={artworkStyles.container}>
                        <div>
                            <div>
                                <div>
                                    <GatsbyImage
                                        image={
                                            images[slideShowIndex]
                                                .childImageSharp.gatsbyImageData
                                        }
                                        alt={`${stripePrice.product.name}`}
                                    />
                                </div>
                                <ul
                                    style={{
                                        display: "flex",
                                        marginTop: 20,
                                        listStyle: "none",
                                    }}
                                >
                                    {images.map((image, index) => (
                                        <li
                                            key={"image" + index}
                                            onClick={() =>
                                                setSliderShowIndex(index)
                                            }
                                            style={{
                                                width: "70px",
                                                cursor: "pointer",
                                                marginRight: "10px",
                                                border: "1px solid white",
                                                borderStyle: "dotted",
                                                borderColor:
                                                    slideShowIndex === index
                                                        ? "rgb(68, 68, 68)"
                                                        : "white",
                                            }}
                                        >
                                            <GatsbyImage
                                                image={
                                                    image.childImageSharp
                                                        .gatsbyImageData
                                                }
                                                alt={`${stripePrice.product.name}`}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h2>Description</h2>
                                <p>
                                    Fine art archival giclée print on Hahnemühle
                                    Photo Rag at 308gsm with subtle fibrous
                                    finish.
                                </p>
                                <p>
                                    Paper dimensions: 22 x 27.25 in (56 x 69.25
                                    cm).<br></br>Image dimensions: 21 x 26.25 in
                                    (35.25 x 66.75 cm).<br></br>Suggested mat:
                                    1.5 inches on sides, and 1.875 inches on top
                                    and bottom (3.80 and 4.75 cm, respectively).
                                </p>
                                <p style={{ marginBottom: 48 }}>
                                    Print purchases are posted with a
                                    certificate of authenticity that includes
                                    the artist’s signature, edition number, size
                                    and paper stock.
                                </p>
                                <h2>Shipping</h2>
                                <p>
                                    The prints are sold unframed and packaged
                                    flat between cardboard for protection.
                                </p>
                                <p style={{ marginBottom: 48 }}>
                                    UK shipping is free and can take 2-3 weeks
                                    to arrive. International shipping is £150
                                    GBP and can take up to 4 weeks to arrive.
                                    Read the full shipping and returns details
                                    here.
                                </p>
                                <h2>
                                    £
                                    {(stripePrice.unit_amount / 100).toFixed(2)}
                                </h2>
                                <button onClick={() => redirectToCheckout()}>
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        </Layout>
    )
}

export default Price

export const query = graphql`
    query($slug: String!) {
        stripePrice(product: { metadata: { slug: { eq: $slug } } }) {
            ...StripePriceFragment
        }
        allPrintsJson(filter: { slug: { eq: $slug } }) {
            edges {
                node {
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
