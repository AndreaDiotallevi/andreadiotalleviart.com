import React, { useEffect, useState } from "react"
import { graphql, PageProps } from "gatsby"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"
import Stripe from "stripe"

import Layout from "../templates/layout"
import { retrieveCheckoutSession } from "../api"

import * as styles from "./success.module.scss"

type DataProps = {
    file: {
        childImageSharp: {
            gatsbyImageData: IGatsbyImageData
        }
    }
}

const Success = ({ data: { file } }: PageProps<DataProps>) => {
    const [session, setSession] = useState<Stripe.Checkout.Session | null>(null)
    const params = new URLSearchParams(location.search)
    const sessionId = params.get("session_id")

    console.log(session)

    useEffect(() => {
        const fetchSession = async () => {
            if (!sessionId) return

            const session = await retrieveCheckoutSession({ sessionId })
            setSession(session)
        }

        fetchSession()
    }, [sessionId])

    if (!session) return "Loading..."

    return (
        <Layout
            seo={{
                title: "Thank You | Andrea Diotallevi",
                description:
                    "Get in touch if you are interested in working together",
                tags: ["Thank You"],
            }}
        >
            <div className={styles.container}>
                <h1 className={styles.h1}>Order Confirmation</h1>
                <div className={styles.grid}>
                    <div>
                        <GatsbyImage
                            image={file.childImageSharp.gatsbyImageData}
                            alt="Profile image"
                        />
                    </div>
                    <div className={styles.gridItem2}>
                        <h2>
                            Thanks for your order{" "}
                            {session.customer_details?.name}!
                        </h2>
                        <p>
                            As soon as your package is on its way, you will
                            receive a delivery confirmation from me by email.
                        </p>
                        <h2>Delivery address</h2>
                        <p>
                            Full Name<br></br>
                            {session.shipping_details?.address?.line1}
                            {session.shipping_details?.address?.line2 ? (
                                <>
                                    <br></br>
                                    {session.shipping_details.address.line2}
                                </>
                            ) : null}
                            {session.shipping_details?.address?.line2}
                            <br></br>
                            {session.shipping_details?.address?.postal_code}
                            <br></br>
                            {session.shipping_details?.address?.city}
                            <br></br>
                            {session.shipping_details?.address?.country}
                            <br></br>
                        </p>
                        <h2>Your items</h2>
                        <p>
                            Flames fine art print<br></br>
                            Dimensions: 30x30 cm<br></br>
                            Quantity: 1
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Success

export const query = graphql`
    {
        file(relativePath: { eq: "assets/profile-photo.jpg" }) {
            childImageSharp {
                gatsbyImageData(
                    width: 660
                    quality: 99
                    layout: CONSTRAINED
                    placeholder: BLURRED
                )
            }
        }
    }
`
