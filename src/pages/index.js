import React from "react"
import { graphql } from "gatsby"

import Layout from "../templates/layout"
import Moonlight from "../components/moonlight"
import PageTitle from "../components/pageTitle"
import Seo from "../components/seo"

import "../styles/index2.scss"

export const query = graphql`
    query {
        fileName: file(relativePath: { eq: "assets/test.png" }) {
            childImageSharp {
                fluid(maxWidth: 660) {
                    ...GatsbyImageSharpFluid
                }
            }
        }
    }
`

const Home = () => {
    return (
        <Layout>
            <Seo
                title="Andrea Diotallevi | Generative Artist and Creative Coder"
                description="The artwork of Andrea Diotallevi, a practising generative artist, creative coder, software engineer, architect and pianist"
            />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                }}
            >
                <PageTitle
                    isHome={true}
                    text="Generative Artist & Creative Coder"
                />
                <Moonlight />
            </div>
        </Layout>
    )
}

export default Home
