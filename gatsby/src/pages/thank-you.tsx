import React from "react"
import { graphql, PageProps } from "gatsby"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"

import Layout from "../templates/layout"

import * as styles from "./thank-you.module.scss"

type DataProps = {
    file: {
        childImageSharp: {
            gatsbyImageData: IGatsbyImageData
        }
    }
}

const ThankYou = ({ data: { file } }: PageProps<DataProps>) => {
    const name = "Andrea"

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
                        <h2>Thanks for your order {name}!</h2>
                        <p>
                            As soon as your package is on its way, you will
                            receive a delivery confirmation from me by email.
                        </p>
                        <h2>Delivery address</h2>
                        <p>
                            Full Name<br></br>
                            Line 1<br></br>
                            Line 2<br></br>
                            SE1 4PU, London, UK
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

export default ThankYou

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
