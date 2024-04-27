import React from "react"
import { graphql, PageProps } from "gatsby"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"

import Layout from "../templates/layout"
import Seo from "../components/seo"

import * as styles from "./about.module.scss"

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

const About = ({ data: { file } }: PageProps<DataProps>) => {
    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div>
                        <GatsbyImage
                            image={file.childImageSharp.gatsbyImageData}
                            alt="Profile image"
                        />
                    </div>
                    <div className={styles.gridItem2}>
                        <h1 className={styles.h1}>About</h1>
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

export default About

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
                original {
                    src
                }
            }
        }
    }
`

export const Head = ({ data: { file } }: PageProps<DataProps>) => (
    <Seo
        title="About | Andrea Diotallevi"
        description="Get to know Andrea Diotallevi."
        image={file.childImageSharp.original.src}
        tags={["About"]}
    />
)
