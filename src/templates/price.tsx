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
}

const Price = ({ data: { stripePrice } }: PageProps<DataProps>) => {
    const [loading, setLoading] = useState(false)

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

    const buttonStyles = {
        display: "block",
        fontSize: "13px",
        // textAlign: "center",
        color: "#000",
        padding: "12px",
        boxShadow: "2px 5px 10px rgba(0,0,0,.1)",
        backgroundColor: "rgb(255, 178, 56)",
        borderRadius: "6px",
        letterSpacing: "1.5px",
    }

    const buttonDisabledStyles = {
        opacity: "0.5",
        cursor: "not-allowed",
    }

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
                            <ul>
                                {stripePrice.product.localFiles.map(
                                    (image, index) => (
                                        <li key={index}>
                                            <GatsbyImage
                                                image={
                                                    image.childImageSharp
                                                        .gatsbyImageData
                                                }
                                                alt={`${stripePrice.product.name}-${index}`}
                                            />
                                        </li>
                                    )
                                )}
                            </ul>
                            <div>
                                <p>{stripePrice.product.description}</p>
                                <button
                                    disabled={loading}
                                    style={
                                        loading
                                            ? {
                                                  ...buttonStyles,
                                                  ...buttonDisabledStyles,
                                              }
                                            : buttonStyles
                                    }
                                    onClick={() => redirectToCheckout()}
                                >
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
    }
`
