import React from "react"

import Layout from "../templates/layout"
import Moonlight from "../components/moonlight"
import PageTitle from "../components/pageTitle"
import Seo from "../components/seo"

import "../styles/index.scss"

const Home = () => {
    return (
        <Layout>
            <React.Fragment>
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
            </React.Fragment>
        </Layout>
    )
}

export default Home
