import React, { useState } from "react"
import { graphql, PageProps } from "gatsby"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"

import Layout from "../templates/layout"

import Button from "../components/button"
import InputField from "../components/inputField"
import Seo from "../components/seo"
import TextArea from "../components/textArea"

import * as styles from "./contact.module.scss"
import { sendContactPageEmail } from "../api"

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
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")

    const [error, setError] = useState("")

    const [success, setSuccess] = useState(false)

    const validate = () => {
        if (!name) {
            setError("Please enter a name.")
            return false
        }

        if (
            !email.match(
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            )
        ) {
            setError("Please enter a valid email.")
            return false
        }

        if (!subject) {
            setError("Please enter a subject.")
            return false
        }

        if (!message) {
            setError("Please enter a message.")
            return false
        }

        setError("")
        return true
    }

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
                        <InputField
                            value={name}
                            name="name"
                            label="Name"
                            onChange={value => setName(value)}
                        />
                        <InputField
                            value={email}
                            name="email"
                            label="Email"
                            onChange={value => setEmail(value)}
                        />
                        <InputField
                            value={subject}
                            name="subject"
                            label="Subject"
                            onChange={value => setSubject(value)}
                        />
                        <TextArea
                            value={message}
                            name="message"
                            label="Message"
                            onChange={value => setMessage(value)}
                        />
                        {error ? <p className={styles.error}>{error}</p> : null}
                        {success ? (
                            <p className={styles.success}>Message sent!</p>
                        ) : null}
                        <Button
                            onClick={async () => {
                                setSuccess(false)
                                setLoading(true)

                                if (validate()) {
                                    await sendContactPageEmail({
                                        name,
                                        email,
                                        subject,
                                        message,
                                    })
                                    setSuccess(true)
                                }
                                setLoading(false)
                            }}
                            loading={loading}
                        >
                            Send message
                        </Button>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Contact

export const query = graphql`
    {
        file(relativePath: { eq: "assets/portrait.jpg" }) {
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
        title="Contact | Andrea Diotallevi"
        description="Get in touch if you are interested in working together."
        image={file.childImageSharp.original.src}
        tags={["Contact"]}
    />
)
