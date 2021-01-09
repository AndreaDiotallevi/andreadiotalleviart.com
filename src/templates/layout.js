import React, { useState } from "react"
import { Location } from '@reach/router'

import Navbar from "../components/navbar"
import Menu from "../components/menu"
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
                        isHome={location.pathname === "/"}
                    />
                    <Menu
                        open={isMenuOpen}
                        onClick={() => setIsMenuOpen(false)}
                        isHome={location.pathname === "/"}
                    />
                    <PageTitle isHome={location.pathname === "/"} />
                    {children}
                    <Footer isHome={location.pathname === "/"} />
                </div>
            )}
        </Location>
    )
}

export default Layout
