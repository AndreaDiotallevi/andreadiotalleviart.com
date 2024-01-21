import React from "react"

import Layout from "../templates/layout"

import * as styles from "./thankyou.module.scss"

const ThankYou = () => {
    return (
        <Layout seo={{ title: "test", description: "", tags: [] }}>
            <table>
                <tbody>
                    <tr>
                        <td colSpan={3} className={styles.title}>
                            Thank You For Your Order!
                        </td>
                    </tr>
                    <tr>
                        <td>Alfreds Futterkiste</td>
                        <td>Maria Anders</td>
                        <td>Germany</td>
                    </tr>
                </tbody>
            </table>
        </Layout>
    )
}

export default ThankYou
