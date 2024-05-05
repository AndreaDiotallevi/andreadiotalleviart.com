import React from "react"

import Layout from "../templates/layout"
import Seo from "../components/seo"
import PageTitle from "../components/pageTitle"

const NotFound = () => {
    return (
        <Layout>
            <div>
                <PageTitle p="We're sorry, but the page you're looking for cannot be found." />
            </div>
        </Layout>
    )
}

export default NotFound

export const Head = () => (
    <Seo
        title="Page Not Found | Andrea Diotallevi Art"
        description="We're sorry, but the page you're looking for cannot be found."
    />
)
