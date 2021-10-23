import React from "react"

import Layout from "../templates/layout"
import Moonlight from "../components/moonlight"
import Seo from "../components/seo"

import "../styles/index.css"

const Home = () => {
    return (
        <Layout>
            <Seo
                title="Andrea Diotallevi | Generative Artist and Creative Coder"
                description="The artwork of Andrea Diotallevi, a practising generative artist, creative coder, software engineer, architect and pianist"
            />
            <Moonlight />
        </Layout>
    )
}

export default Home
