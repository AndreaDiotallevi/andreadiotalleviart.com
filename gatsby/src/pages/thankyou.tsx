import React from "react"

import Layout from "../templates/layout"

import * as styles from "./thankyou.module.scss"

const ThankYou = () => {
    return (
        <Layout seo={{ title: "test", description: "", tags: [] }}>
            <table className={styles.table}>
                <tbody>
                    <tr>
                        <td colSpan={3} className={styles.title}>
                            Thanks for your order Bob!
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={3}>
                            As soon as your package is on its way, you will
                            receive a delivery confirmation from me by email.
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={3} className={styles.header}>
                            Delivery address
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={3}>
                            Andrea Diotallevi<br></br>
                            Line 1<br></br>
                            Line 2<br></br>
                            Postcode<br></br>
                            London<br></br>
                            UK
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={3} className={styles.header}>
                            Your items
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={3}>
                            Archival Pigment Print of Flames<br></br>
                            Dimensions: 30x30cm<br></br>
                            Quantity: 1
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={3} className={styles.header}>
                            Payment summary
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Payment method: Debit / Credit Card<br></br>
                            Subtotal: £99.00<br></br>
                            Shipping fee: Free<br></br>
                            Discounts: £0.00<br></br>
                            Total: £99.00
                        </td>
                    </tr>
                </tbody>
            </table>
        </Layout>
    )
}

export default ThankYou
