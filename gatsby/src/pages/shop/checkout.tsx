import React from "react"
import { PageProps } from "gatsby"
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

import Layout from "../../templates/layout"
import { StripePrice } from "../../models/stripe"

import * as styles from "./checkout.module.scss"
import Seo from "../../components/seo"

type DataProps = {
    stripePrice: StripePrice
}

const stripePromise = loadStripe(
    process.env.GATSBY_STRIPE_PUBLISHABLE_KEY || "",
)

const Checkout = ({ location }: PageProps<DataProps>) => {
    const params = new URLSearchParams(location.search)
    const clientSecret = params.get("clientSecret")

    return (
        <Layout>
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

export default Checkout

export const Head = () => (
    <Seo
        title="Checkout | Andrea Diotallevi"
        description="Complete your purchase quickly and securely with Stripe. Our streamlined checkout process is safe and easy, ensuring your details are protected."
        tags={[
            "Generative Art",
            "p5.js",
            "Processing",
            "Procedural",
            "Print",
            "Giclee",
        ]}
    />
)
