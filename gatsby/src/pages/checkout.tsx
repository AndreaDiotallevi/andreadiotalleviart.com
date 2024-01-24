import React, { useState } from "react"
import { PageProps } from "gatsby"
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

import Layout from "../templates/layout"
import { StripePrice } from "../models/stripe"
import { Print } from "../models/prints"

import * as styles from "./checkout.module.scss"

type DataProps = {
    stripePrice: StripePrice
    printsJson: Print
}

const stripePromise = loadStripe(
    process.env.GATSBY_STRIPE_PUBLISHABLE_KEY || ""
)

const CheckoutForm = ({ location }: PageProps<DataProps>) => {
    const params = new URLSearchParams(location.search)
    const clientSecret = params.get("clientSecret")
    const [loading, setLoading] = useState(false)

    return (
        <Layout
            loading={loading}
            seo={{
                title: `Checkout | Andrea Diotallevi`,
                description: "Checkout",
                tags: [
                    "Generative Art",
                    "p5.js",
                    "Processing",
                    "Procedural",
                    "Print",
                    "Giclee",
                ],
            }}
        >
            <div id="checkout" className={styles.container}>
                {clientSecret && (
                    <EmbeddedCheckoutProvider
                        stripe={stripePromise}
                        options={{ clientSecret }}
                    >
                        <EmbeddedCheckout />
                    </EmbeddedCheckoutProvider>
                )}
            </div>
        </Layout>
    )
}

export default CheckoutForm
