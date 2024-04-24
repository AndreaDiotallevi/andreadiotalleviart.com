import React from "react"

import * as styles from "./textArea.module.scss"

const TextArea = ({
    value,
    name,
    label,
    onChange,
    error,
}: {
    value: string
    name: string
    label?: string
    onChange: (value: string) => void
    error?: string
}) => {
    return (
        <div className={styles.container}>
            {label ? <label className={styles.label}>{label}</label> : null}
            <textarea
                value={value}
                className={styles.input}
                name={name}
                onChange={event => onChange(event.target.value)}
            />
            {/* {error ? <p className={styles.error}>{error}</p> : null} */}
        </div>
    )
}

export default TextArea
