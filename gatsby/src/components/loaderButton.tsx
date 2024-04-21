import React from "react"

import * as styles from "./loaderButton.module.scss"

const LoaderButton = () => {
    return (
        <div className={styles.container}>
            <span className={styles.loader}></span>
        </div>
    )
}

export default LoaderButton
