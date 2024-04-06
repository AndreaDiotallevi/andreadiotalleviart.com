import React from "react"

import * as menuToggleButtonStyles from "./menuToggleButton.module.scss"

type DataProps = {
    open: boolean
    onClick: () => void
    isHome: boolean
}

const MenuToggleButton = (props: DataProps) => {
    const { open, onClick, isHome } = props

    return (
        <button
            className={`${menuToggleButtonStyles.toggleButton} ${
                open ? menuToggleButtonStyles.menuOpen : ""
            } ${isHome ? menuToggleButtonStyles.isHome : ""}`}
            onClick={onClick}
            aria-label="menu-toggle"
        >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </button>
    )
}

export default MenuToggleButton
