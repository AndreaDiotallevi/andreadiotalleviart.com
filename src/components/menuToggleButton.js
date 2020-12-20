import React from "react"

import menuToggleButtonStyles from "./menuToggleButton.module.scss"

const MenuToggleButton = ({ open, onClick, location }) => {
    return (
        <button
            className={`${menuToggleButtonStyles.toggleButton} ${open ? menuToggleButtonStyles.menuOpen : ""} ${location.pathname === "/" ? menuToggleButtonStyles.isHome : ""}`}
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
