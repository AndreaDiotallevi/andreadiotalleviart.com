import React from "react"

import MenuItem from "./menuItem"
import routes from "../utils/routes"

import * as menuStyles from "./menu.module.scss"

const Menu = ({ open, onClick, isHome }) => {
    if (!open) {
        return null
    }

    return (
        <div
            className={`${menuStyles.menu} ${isHome ? menuStyles.isHome : ""}`}
        >
            <ul>
                {routes.map((item, index) => (
                    <MenuItem
                        key={index}
                        onClick={onClick}
                        item={item}
                        isHome={isHome}
                    />
                ))}
            </ul>
        </div>
    )
}

export default Menu
