import React from "react"

import * as styles from "./inputField.module.scss"

const InputField = ({
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
            <input
                className={styles.input}
                name={name}
                value={value}
                onChange={event => onChange(event.target.value)}
            />
            {/* {error ? <p className={styles.error}>{error}</p> : null} */}
        </div>
    )
}

export default InputField
