import React from "react"

import * as styles from "./loader.module.scss"

const Loader = () => {
    return (
        <div className={styles.container}>
            <span className={styles.loader}></span>
        </div>
    )
}

export default Loader
