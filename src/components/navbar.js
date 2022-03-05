import React from "react"
import { Link } from "gatsby"

import MenuToggleButton from "./menuToggleButton"
import routes from "../utils/routes"

import * as navbarStyles from "./navbar.module.scss"

const Navbar = ({ open, onClick, isHome }) => (
    <header
        className={`${navbarStyles.header} ${
            isHome ? navbarStyles.homepage : ""
        }`}
    >
        <div>
            <Link to="/">
                <h2>Andrea Diotallevi</h2>
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
            <MenuToggleButton open={open} onClick={onClick} isHome={isHome} />
        </div>
    </header>
)

export default Navbar
