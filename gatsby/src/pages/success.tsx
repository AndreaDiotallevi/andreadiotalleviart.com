import React, { useEffect, useState } from "react"
import { graphql, PageProps, Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import Stripe from "stripe"

import Layout from "../templates/layout"

import { retrieveCheckoutSession } from "../api"

import * as styles from "./success.module.scss"
import { StripePrice } from "../models/stripe"

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
            setSession(session)
        }

        fetchSession()
    }, [sessionId])

    return (
        <Layout
            loading={session === null}
            seo={{
                title: "Order Confirmation | Andrea Diotallevi",
                description:
                    "You will receive a confirmation email with the details of your order.",
                tags: ["Thanks You For Your Order"],
            }}
        >
            {session ? (
                <div className={styles.container}>
                    <h1 className={styles.h1}>Order Confirmation</h1>
                    <div className={styles.grid}>
                        <div>
                            <GatsbyImage
                                image={
                                    allStripePrice.edges.filter(
                                        edge =>
                                            edge.node.product.metadata.slug ===
                                            session.line_items?.data[0].price
                                                ?.product.metadata.slug
                                    )[0].node.images[0].childImageSharp
                                        .gatsbyImageData
                                }
                                alt="Profile image"
                            />
                        </div>
                        <div className={styles.gridItem2}>
                            <h2>Thank you for your order</h2>
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
                                        {item.price?.product.name} -{" "}
                                        {item.price?.product.description}
                                    </p>
                                </div>
                            ))}
                            <h2>Payment summary</h2>
                            <p>
                                Subtotal: £
                                {((session.amount_subtotal || 0) / 100).toFixed(
                                    2
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
                            <Link to="/shop" className={styles.button}>
                                Discover More
                            </Link>
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
