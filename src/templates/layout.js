import React, { useState } from "react"
import { Location } from '@reach/router'

import Navbar from "../components/navbar"
import PageTitle from "../components/pageTitle"
import Footer from "../components/footer"

const Layout = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <Location>
            {({ location }) => (
                <div className="app">
                    <Navbar
                        open={isMenuOpen}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        location={location}
                    />
                    <PageTitle location={location} />
                    {children}
                    <Footer location={location} />
                </div>
            )}
        </Location>
    )
}

export default Layout
