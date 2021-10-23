import React from "react"

import * as pageTitleStyles from "./pageTitle.module.scss"

const PageTitle = ({ isHome }) => {
    return (
        <div
            className={`${pageTitleStyles.container} ${
                isHome ? pageTitleStyles.isHome : ""
            }`}
        >
            <div>
                <p>generative artist and creative coder</p>
            </div>
        </div>
    )
}

export default PageTitle
