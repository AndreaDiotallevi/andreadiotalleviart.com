import React from "react"

import Layout from "../templates/layout"
import Moonlight from "../components/moonlight"
import PageTitle from "../components/pageTitle"

import "../styles/index.scss"

const Home = () => {
    return (
        <Layout
            seo={{
                title: "Andrea Diotallevi | Generative Artist and Creative Coder",
                description:
                    "The artwork of Andrea Diotallevi, a practising generative artist, creative coder, software engineer, architect and pianist",
                tags: [
                    "Andrea Diotallevi",
                    "Andrea Diotallevi Art",
                    "Generative Art",
                    "Album Covers",
                    "NFTs",
                ],
            }}
        >
            <React.Fragment>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        backgroundColor: "#38444c", // RGB (56, 68, 76)
                    }}
                >
                    <PageTitle
                        isHome={true}
                        text="Generative Artist & Creative Coder"
                    />
                    <Moonlight />
                </div>
            </React.Fragment>
        </Layout>
    )
}

export default Home
