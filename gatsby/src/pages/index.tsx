import React from "react"
import { PageProps, graphql } from "gatsby"

import Layout from "../templates/layout"
import Moonlight from "../components/moonlight"
import PageTitle from "../components/pageTitle"
import Seo from "../components/seo"

import "../styles/index.scss"

type DataProps = {
    file: {
        childImageSharp: {
            original: {
                src: string
            }
        }
    }
}

const Home = () => {
    return (
        <Layout>
            <React.Fragment>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        backgroundColor: "#38444c", // RGB (56, 68, 76)
                    }}
                >
                    <PageTitle isHome h1="Generative Artist & Creative Coder" />
                    <Moonlight />
                </div>
            </React.Fragment>
        </Layout>
    )
}

export default Home

export const Head = ({ data: { file } }: PageProps<DataProps>) => (
    <Seo
        title="Andrea Diotallevi | Generative Artist and Creative Coder"
        description="The artwork of Andrea Diotallevi, a practising generative artist, creative coder, software engineer, architect and pianist."
        image={file.childImageSharp.original.src}
        tags={[
            "Andrea Diotallevi",
            "Andrea Diotallevi Art",
            "Generative Art",
            "Album Covers",
            "NFTs",
            "Giclee Fine Art Prints",
        ]}
    />
)

export const query = graphql`
    {
        file(relativePath: { eq: "assets/moonlight.png" }) {
            childImageSharp {
                original {
                    src
                }
            }
        }
    }
`
