import { useEffect, useState } from "react"

import type { Currency, StripePrice } from "../../utils/stripe"
import { getLocaleCurrency } from "../../utils/serverless"
import { formatCurrency } from "../../utils/intl"

interface Props {
    price: StripePrice
}

const LocalisedPrice = ({ price }: Props) => {
    const [currency, setCurrency] = useState<Currency | null>(null)

    useEffect(() => {
        const fetchLocaleCurrency = async () => {
            const currency = await getLocaleCurrency()
            setCurrency(currency as Currency)
        }

        fetchLocaleCurrency()
    }, [])

    if (!currency)
        return (
            <svg
                className="animate-spin h-5 w-5 text-black inline-block"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
        )

    return formatCurrency({
        value: price.currency_options[currency].unit_amount,
        currency,
    })
}

export default LocalisedPrice
