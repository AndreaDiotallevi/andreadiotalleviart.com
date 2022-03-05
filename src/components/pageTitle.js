import React from "react"

import * as pageTitleStyles from "./pageTitle.module.scss"

const PageTitle = ({ isHome, text }) => {
    return (
        <div
            className={`${pageTitleStyles.container} ${
                isHome ? pageTitleStyles.isHome : ""
            }`}
        >
            <h1>{text}</h1>
        </div>
    )
}

export default PageTitle
