import React from "react"
import { graphql, PageProps } from "gatsby"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"

import Layout from "../templates/layout"
import PageTitle from "../components/pageTitle"

import * as contactStyles from "./contact.module.scss"

type DataProps = {
    file: {
        childImageSharp: {
            gatsbyImageData: IGatsbyImageData
        }
    }
}

const Contact = ({ data: { file } }: PageProps<DataProps>) => {
    return (
        <Layout
            seo={{
                title: "Contact | Andrea Diotallevi",
                description:
                    "Get in touch if you are interested in working together",
                tags: ["Contact", "About"],
            }}
        >
            <React.Fragment>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%",
                        marginBottom: "50px",
                    }}
                >
                    <PageTitle isHome={false} text="" />
                    <div className={contactStyles.fixed}>
                        <p>Contact</p>
                    </div>
                    <div className={contactStyles.container}>
                        <div className={contactStyles.image}>
                            <GatsbyImage
                                image={file.childImageSharp.gatsbyImageData}
                                alt="Profile image"
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
                        </div>
                    </div>
                </div>
            </React.Fragment>
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
                    placeholder: BLURRED
                )
            }
        }
    }
`
