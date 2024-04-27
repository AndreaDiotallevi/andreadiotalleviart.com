import React, { ChangeEvent } from "react"

import * as styles from "./inputSelect.module.scss"

const InputSelect = ({
    name,
    onChange,
    options,
}: {
    name: string
    onChange: (event: ChangeEvent<HTMLSelectElement>) => void
    options: { key: string; value: string; display: string }[]
}) => {
    return (
        <select
            name={name}
            onChange={onChange}
            className={styles.select}
            defaultValue={options[0].value}
        >
            {options.map(edge => (
                <option key={edge.key} value={edge.value}>
                    {edge.display}
                </option>
            ))}
        </select>
    )
}

export default InputSelect
