import React, { useEffect, useState } from "react"
import { graphql, PageProps, navigate } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import Stripe from "stripe"

import Layout from "../../../templates/layout"

import Button from "../../../components/button"
import Seo from "../../../components/seo"

import { StripePrice } from "../../../models/stripe"

import { retrieveCheckoutSession } from "../../../api"
import { sendGA4PurchaseEvent } from "../../../services/ga4"

import * as styles from "./success.module.scss"

type DataProps = {
    allStripePrice: {
        edges: [{ node: StripePrice }]
    }
}

const Success = ({
    data: { allStripePrice },
    location,
}: PageProps<DataProps>) => {
    const [session, setSession] = useState<Stripe.Checkout.Session | null>(null)
    const params = new URLSearchParams(location.search)
    const sessionId = params.get("session_id")

    useEffect(() => {
        const fetchSession = async () => {
            if (!sessionId) return

            const session = await retrieveCheckoutSession({ sessionId })

            if (!session) return

            setSession(session)
            sendGA4PurchaseEvent({ session })
        }

        fetchSession()
    }, [sessionId])

    return (
        <Layout loading={session === null}>
            {session ? (
                <div className={styles.container}>
                    <div className={styles.grid}>
                        <div>
                            <GatsbyImage
                                image={
                                    allStripePrice.edges.filter(
                                        edge =>
                                            edge.node.product.metadata.slug ===
                                            session.line_items?.data[0].price
                                                ?.product.metadata.slug,
                                    )[0].node.mockup.childImageSharp
                                        .gatsbyImageData
                                }
                                alt="Profile image"
                            />
                        </div>
                        <div className={styles.gridItem2}>
                            <h1 className={styles.h1}>
                                Thank you for your order!
                            </h1>
                            <p>
                                You will receive a confirmation email with the
                                details of your order.
                            </p>
                            <h2>Delivery address</h2>
                            <p>
                                {session.shipping_details?.name}
                                <br></br>
                                {session.shipping_details?.address?.line1}
                                <br></br>
                                {session.shipping_details?.address?.line2 ? (
                                    <>
                                        {session.shipping_details.address.line2}
                                        <br></br>
                                    </>
                                ) : null}
                                {session.shipping_details?.address?.postal_code}
                                , {session.shipping_details?.address?.city},{" "}
                                {session.shipping_details?.address?.country}
                            </p>
                            <h2>Items</h2>
                            {session.line_items?.data.map(item => (
                                <div key={item.id}>
                                    <p>
                                        {
                                            item.price?.product.metadata
                                                .displayName
                                        }
                                        <br></br>
                                        {item.price?.product.description}
                                    </p>
                                </div>
                            ))}
                            <h2>Payment summary</h2>
                            <p>
                                Subtotal: £
                                {((session.amount_subtotal || 0) / 100).toFixed(
                                    2,
                                )}
                                <br></br>
                                Shipping fee: Free<br></br>
                                Discounts: £
                                {(
                                    (session.total_details?.amount_discount ||
                                        0) / 100
                                ).toFixed(2)}
                                <br></br>
                                Total: £
                                {((session.amount_total || 0) / 100).toFixed(2)}
                            </p>
                            <Button
                                role="link"
                                onClick={() => navigate("/shop")}
                            >
                                Discover More
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </Layout>
    )
}

export default Success

export const query = graphql`
    {
        allStripePrice(
            filter: { active: { eq: true }, product: { active: { eq: true } } }
        ) {
            edges {
                node {
                    ...StripePriceFragment
                }
            }
        }
    }
`

export const Head = () => (
    <Seo
        title="Checkout Success | Andrea Diotallevi Art"
        description="Thank you for your purchase! Your order has been successfully placed. Check your email for order details and shipping information."
    />
)
