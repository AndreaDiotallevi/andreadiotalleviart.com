import React from "react"

import * as pageTitleStyles from "./pageTitle.module.scss"

type DataProps = {
    isHome?: boolean
    h1?: string
    p?: string
}

const PageTitle = (props: DataProps) => {
    const { isHome = false, h1, p } = props

    return (
        <div
            className={`${pageTitleStyles.container} ${
                isHome ? pageTitleStyles.isHome : ""
            }`}
        >
            {h1 ? <h1>{h1}</h1> : null}
            {p ? <p>{p}</p> : null}
        </div>
    )
}

export default PageTitle
