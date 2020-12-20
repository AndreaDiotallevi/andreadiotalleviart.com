import React from "react"

import MenuItem from "./menuItem"
import routes from "../utils/routes"

import menuStyles from "./menu.module.scss"

const Menu = ({ open, onClick }) => {
    if (!open) {
        return null
    }

    return (
        <div className={menuStyles.menu}>
            <ul>
                {routes.map((item, index) => (
                    <MenuItem
                        key={index}
                        onClick={onClick}
                        item={item}
                    />
                ))}
            </ul>
        </div>
    )
}

export default Menu
