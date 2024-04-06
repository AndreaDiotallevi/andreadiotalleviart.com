import React, { useState } from "react"
import { Location } from "@reach/router"

import Loader from "../components/loader"
import Navbar from "../components/navbar"
import Menu from "../components/menu"
import Footer from "../components/footer"
import Seo from "../components/seo"

import "../styles/prism-modified.css"

type DataProps = {
    children: JSX.Element
    loading?: boolean
    seo: {
        title: string
        description: string
        tags: string[]
    }
}

const Layout = ({ children, loading = false, seo }: DataProps) => {
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
                    <Seo
                        title={seo.title}
                        description={seo.description}
                        tags={seo.tags}
                        isMenuOpen={isMenuOpen}
                    />
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
