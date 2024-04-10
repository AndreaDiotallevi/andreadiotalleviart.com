import React, { useState } from "react"
import { Location } from "@reach/router"

import Loader from "../components/loader"
import Navbar from "../components/navbar"
import Menu from "../components/menu"
import Footer from "../components/footer"

import "../styles/prism-modified.css"

type DataProps = {
    children: JSX.Element
    loading?: boolean
}

const Layout = ({ children, loading = false }: DataProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <Location>
            {({ location }) => (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%",
                        minHeight: "100dvh",
                    }}
                >
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
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            flex: "auto",
                            width: "100%",
                        }}
                    >
                        {loading ? <Loader /> : children}
                    </div>
                    <Footer isHome={location.pathname === "/"} />
                </div>
            )}
        </Location>
    )
}

export default Layout
