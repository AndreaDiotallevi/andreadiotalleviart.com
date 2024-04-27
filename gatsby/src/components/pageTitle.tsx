import React from "react"

import * as pageTitleStyles from "./pageTitle.module.scss"

type DataProps = {
    isHome?: boolean
    text: string
}

const PageTitle = (props: DataProps) => {
    const { isHome = false, text } = props

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
