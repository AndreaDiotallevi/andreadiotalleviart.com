import { useEffect, useState } from "react"

import type { Currency, StripePrice } from "../../utils/stripe"
import { getLocaleCurrency } from "../../utils/serverless"

interface Props {
    price: StripePrice
}

const currencyToSymbol: Record<Currency, string> = {
    eur: "€",
    gbp: "£",
    usd: "$",
}

const LocalisedPrice = ({ price }: Props) => {
    const [currencyOption, setCurrencyOption] = useState(
        price.currency_options.gbp,
    )

    const [currencySymbol, setCurrencySymbol] = useState("£")

    useEffect(() => {
        const fetchLocale = async () => {
            const currency = await getLocaleCurrency()

            setCurrencyOption(
                price.currency_options[currency.toLowerCase() as Currency],
            )

            setCurrencySymbol(
                currencyToSymbol[currency.toLowerCase() as Currency],
            )
        }

        fetchLocale()
    }, [])

    if (!currencyOption) return

    return (
        <p className="text-lg font-medium mt-2">
            {currencySymbol}
            {(currencyOption.unit_amount / 100).toFixed(2)}
        </p>
    )
}

export default LocalisedPrice
