import React, { useEffect, useState } from "react"
import { graphql, PageProps, Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import Stripe from "stripe"

import Loader from "../components/loader"
import Layout from "../templates/layout"
import { Print } from "../models/prints"

import { retrieveCheckoutSession } from "../api"

import * as styles from "./success.module.scss"

type DataProps = {
    allPrintsJson: {
        edges: [{ node: Print }]
    }
}

const Success = ({
    data: { allPrintsJson },
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
                tags: ["Thanks For Your Order"],
            }}
        >
            {session ? (
                <div className={styles.container}>
                    <h1 className={styles.h1}>Order Confirmation</h1>
                    <div className={styles.grid}>
                        <div>
                            <GatsbyImage
                                image={
                                    allPrintsJson.edges.filter(
                                        edge =>
                                            edge.node.slug ===
                                            session.line_items?.data[0].price
                                                ?.product.metadata.slug
                                    )[0].node.images[0].childImageSharp
                                        .gatsbyImageData
                                }
                                alt="Profile image"
                            />
                        </div>
                        <div className={styles.gridItem2}>
                            <h2>
                                Thanks for your order{" "}
                                {session.customer_details?.name}!
                            </h2>
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
                            <h2>Your items</h2>
                            {session.line_items?.data.map(item => (
                                <div key={item.id}>
                                    <p>
                                        {item.description}
                                        <br></br>
                                        Quantity: {item.quantity}
                                    </p>
                                </div>
                            ))}
                            <h2>Payment Summary</h2>
                            <p>
                                Subtotal:{" "}
                                {((session.amount_subtotal || 0) / 100).toFixed(
                                    2
                                )}
                                <br></br>
                                Shipping fee: Free<br></br>
                                Total: £
                                {((session.amount_total || 0) / 100).toFixed(2)}
                            </p>
                            <h2 style={{ marginBottom: 24 }}>
                                With love, Andrea
                            </h2>
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
        allPrintsJson {
            edges {
                node {
                    ...PrintFragment
                }
            }
        }
    }
`
