import React from "react"
import { Link } from "gatsby"

import MenuToggleButton from "./menuToggleButton"
import routes from "../utils/routes"

import * as navbarStyles from "./navbar.module.scss"

type DataProps = {
    open: boolean
    onClick: () => void
    isHome: boolean
}

const Navbar = (props: DataProps) => {
    const { open, onClick, isHome } = props

    return (
        <header
            className={`${navbarStyles.header} ${
                isHome ? navbarStyles.homepage : ""
            }`}
        >
            <div>
                <Link to="/">
                    <h2>andreadiotallevi</h2>
                </Link>
                <ul>
                    {routes.map(({ menuName, baseUrl }) => (
                        <li key={menuName}>
                            <Link to={baseUrl} activeStyle={{ opacity: 0.7 }}>
                                {menuName}
                            </Link>
                        </li>
                    ))}
                </ul>
                <MenuToggleButton
                    open={open}
                    onClick={onClick}
                    isHome={isHome}
                />
            </div>
        </header>
    )
}

export default Navbar
