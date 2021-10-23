import React from "react"
import { Link } from "gatsby"

import * as menuItemStyles from "./menuItem.module.scss"

const MenuItem = ({ item, onClick, isHome }) => {
    return (
        <Link
            to={`${item.baseUrl}`}
            onClick={onClick}
            className={`${menuItemStyles.link} ${
                isHome ? menuItemStyles.isHome : ""
            }`}
            activeClassName={menuItemStyles.activeNavItem}
        >
            {item.menuName}
        </Link>
    )
}

export default MenuItem
