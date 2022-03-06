import React from "react"
import { graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"

import Layout from "../templates/layout"
import Seo from "../components/seo"
import PageTitle from "../components/pageTitle"

import * as contactStyles from "./contact.module.scss"

export const query = graphql`
    {
        fileName: file(relativePath: { eq: "assets/profile-photo.jpg" }) {
            childImageSharp {
                gatsbyImageData(
                    width: 660
                    layout: CONSTRAINED
                    placeholder: BLURRED
                )
            }
        }
    }
`

const Contact = props => {
    return (
        <Layout>
            <Seo
                title="Contact | Andrea Diotallevi"
                description="Get in touch if you are interested in working together"
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
                <PageTitle isHome={false} text="Contact" />
                <div className={contactStyles.container}>
                    <div>
                        <div className={contactStyles.image}>
                            <GatsbyImage
                                image={
                                    props.data.fileName.childImageSharp
                                        .gatsbyImageData
                                }
                            />
                        </div>
                        <div className={contactStyles.text}>
                            <p>
                                I am a generative artist and creative coder
                                based in London.
                            </p>
                            <p>
                                As a pianist and former architect, I am
                                fascinated by the intersection between art and
                                technology and I am in constant exploration of
                                generative art concepts. For each new work, I
                                design a custom algorithm capable of generating
                                a sequence of unique, but aesthetically related
                                images.
                            </p>
                            <p>------</p>
                            <p>Email:</p>
                            <a
                                href="mailto: andrea.diotallevi@outlook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                andrea.diotallevi@outlook.com
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Contact
