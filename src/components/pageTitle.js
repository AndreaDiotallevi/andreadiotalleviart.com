import React from "react"

import pageTitleStyles from "./pageTitle.module.scss"

const PageTitle = ({ location }) => {
    return (
        <div className={`${pageTitleStyles.container} ${location.pathname === "/" ? pageTitleStyles.isHome : ""}`}>
            <div>
                <p>generative artist and creative coder</p>
            </div>
        </div>
    )
}

export default PageTitle
