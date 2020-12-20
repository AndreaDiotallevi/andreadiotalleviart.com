import React from "react"
import { Link } from "gatsby"

import menuItemStyles from "./menuItem.module.scss"

const MenuItem = ({ item, onClick }) => {
    return (
        <Link
            to={`${item.baseUrl}`}
            onClick={onClick}
            className={menuItemStyles.link}
        >
            {item.menuName}
        </Link>
    )
}

export default MenuItem
