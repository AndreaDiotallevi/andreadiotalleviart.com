import React from "react"
import { Link } from "gatsby"

import MenuToggleButton from "./menuToggleButton"
import routes from "../utils/routes"

import * as styles from "./navbar.module.scss"

type DataProps = {
    open: boolean
    onClick: () => void
    isHome: boolean
}

const Navbar = (props: DataProps) => {
    const { open, onClick, isHome } = props

    return (
        <header className={`${styles.header} ${isHome ? styles.home : ""}`}>
            <div className={styles.headerContainer}>
                <Link to="/">
                    <h2 className={styles.logo}>AD</h2>
                </Link>
                <ul className={styles.linksContainer}>
                    {routes.map(({ menuName, baseUrl }) => (
                        <li key={menuName} className={styles.link}>
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
