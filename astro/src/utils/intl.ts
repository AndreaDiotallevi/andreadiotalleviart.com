export function formatCurrency({
    value,
    currency = "gbp",
}: {
    value: number
    currency: string
}) {
    return new Intl.NumberFormat("en", {
        style: "currency",
        currency: currency.toUpperCase(),
        minimumFractionDigits: 2,
    }).format(value / 100)
}
