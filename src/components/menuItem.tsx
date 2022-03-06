import React from "react"
import { Link } from "gatsby"
import { RouteType } from "../utils/routes"

import * as menuItemStyles from "./menuItem.module.scss"

type DataProps = {
    item: RouteType
    onClick: () => void
    isHome: boolean
}

const MenuItem = (props: DataProps) => {
    const { item, onClick, isHome } = props

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
