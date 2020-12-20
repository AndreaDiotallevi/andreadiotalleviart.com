import React from "react"
import { Link } from "gatsby"

import MenuToggleButton from "./menuToggleButton"
import routes from "../utils/routes"

import navbarStyles from "./navbar.module.scss"

const Navbar = ({ open, onClick, location }) => {
    return (
        <div className={`${navbarStyles.container} ${location.pathname === "/" ? navbarStyles.isHome : ""}`}>
            <nav className={navbarStyles.navbar}>
                <div>
                    <Link to="/">
                        <p className={`${location.pathname === "/" ? navbarStyles.isHome : ""}`}>Andrea Diotallevi</p>
                    </Link>
                </div>
                <ul>
                    {routes.map(({ menuName, baseUrl }) => (
                        <li key={menuName}>
                            <Link
                                to={baseUrl}
                                className={`${location.pathname === "/" ? navbarStyles.isHome : ""}`}
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
                    location={location}
                />
            </nav>
        </div>
    )
}

export default Navbar
