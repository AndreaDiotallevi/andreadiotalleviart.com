import React from "react"
import { graphql, PageProps } from "gatsby"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"

import Layout from "../templates/layout"
import Seo from "../components/seo"

import * as styles from "./contact.module.scss"

type DataProps = {
    file: {
        childImageSharp: {
            gatsbyImageData: IGatsbyImageData
            original: {
                src: string
            }
        }
    }
}

const Contact = ({ data: { file } }: PageProps<DataProps>) => {
    return (
        <Layout>
            <div className={styles.container}>
                <h1 className={styles.h1}>Contact</h1>
                <div className={styles.grid}>
                    <div>
                        <GatsbyImage
                            image={file.childImageSharp.gatsbyImageData}
                            alt="Profile image"
                        />
                    </div>
                    <div className={styles.gridItem2}>
                        <p>
                            My name is Andrea Diotallevi. I am a generative
                            artist and creative coder based in London.
                        </p>
                        <p>
                            As a pianist and former architect, I am fascinated
                            by the intersection between art and technology and I
                            am in constant exploration of generative art
                            concepts.
                        </p>
                        <p>
                            For each new work, I design a custom algorithm
                            capable of generating a sequence of unique, but
                            aesthetically related images.
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Contact

export const query = graphql`
    {
        file(relativePath: { eq: "assets/profile-photo.jpg" }) {
            childImageSharp {
                gatsbyImageData(
                    width: 660
                    quality: 99
                    layout: CONSTRAINED
                    placeholder: DOMINANT_COLOR
                )
                original {
                    src
                }
            }
        }
    }
`

export const Head = ({ data: { file } }: PageProps<DataProps>) => (
    <Seo
        title="Contact | Andrea Diotallevi"
        description="Get in touch if you are interested in working together."
        image={file.childImageSharp.original.src}
        tags={["Contact", "About"]}
    />
)
