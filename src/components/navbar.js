import React from "react"
import { Link } from "gatsby"

import MenuToggleButton from "./menuToggleButton"
import routes from "../utils/routes"

import * as navbarStyles from "./navbar.module.scss"

const Navbar = ({ open, onClick, isHome }) => {
    return (
        <header
            className={`${navbarStyles.container} ${
                isHome ? navbarStyles.isHome : ""
            }`}
        >
            <nav className={navbarStyles.navbar}>
                <div>
                    <Link to="/">
                        <p className={`${isHome ? navbarStyles.isHome : ""}`}>
                            Andrea Diotallevi
                        </p>
                    </Link>
                </div>
                <ul>
                    {routes.map(({ menuName, baseUrl }) => (
                        <li key={menuName}>
                            <Link
                                to={baseUrl}
                                className={`${
                                    isHome ? navbarStyles.isHome : ""
                                }`}
                                activeClassName={navbarStyles.activeNavItem}
                            >
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
            </nav>
        </header>
    )
}

export default Navbar
