import React from "react"

import * as styles from "./button.module.scss"
import LoaderButton from "./loaderButton"

const Button = ({
    children,
    onClick,
    role = "button",
    loading = false,
}: {
    children: string
    onClick: () => void
    role?: "button" | "link"
    loading?: boolean
}) => {
    return (
        <div>
            <button
                role={role}
                className={styles.button}
                onClick={event => {
                    event.preventDefault()
                    onClick()
                }}
            >
                <div className={styles.contentContainer}>
                    {children}
                    {loading ? <LoaderButton /> : null}
                </div>
            </button>
        </div>
    )
}

export default Button
