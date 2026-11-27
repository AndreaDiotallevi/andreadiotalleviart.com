import { getParameterValue } from "./ssm_getParameterValue"

export type CreativehubOrderItem = {
    variant_id: string
    quantity: number
}

export type CreativehubDelivery = {
    delivery_name: string
    delivery_line1: string
    delivery_line2?: string
    delivery_city: string
    delivery_county?: string
    delivery_postcode?: string
    delivery_country_code: string
    delivery_email?: string
    delivery_phone?: string
}

export type CreativehubOrderSummary = {
    id?: string
    order_id?: string
    order_number?: string
    status?: string
    external_reference?: string | null
    [key: string]: unknown
}

export class CreativehubApiError extends Error {
    status: number
    body: unknown

    constructor(status: number, body: unknown) {
        super(`CreativeHub API responded with ${status}`)
        this.status = status
        this.body = body
    }
}

const request = async <T>({
    method,
    path,
    body,
    headers,
}: {
    method: "GET" | "POST"
    path: string
    body?: unknown
    headers?: Record<string, string>
}): Promise<T> => {
    const baseUrl = process.env.CREATIVEHUB_API_URL
    if (!baseUrl) {
        throw new Error("Missing CREATIVEHUB_API_URL")
    }

    const apiKey = await getParameterValue<string>({
        name: "CREATIVEHUB_API_KEY",
        withDecryption: true,
    })

    const response = await fetch(`${baseUrl}${path}`, {
        method,
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            ...headers,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
    })

    const text = await response.text()
    const data = text ? (JSON.parse(text) as unknown) : null

    if (!response.ok) {
        throw new CreativehubApiError(response.status, data)
    }

    return data as T
}

export const findOrderByExternalReference = async (
    externalReference: string,
): Promise<CreativehubOrderSummary | null> => {
    const query = new URLSearchParams({
        external_reference: externalReference,
        limit: "5",
    })
    const data = await request<
        { orders?: CreativehubOrderSummary[] } | CreativehubOrderSummary[]
    >({ method: "GET", path: `/orders?${query.toString()}` })

    const orders = Array.isArray(data) ? data : (data.orders ?? [])
    return (
        orders.find(order => order.external_reference === externalReference) ??
        null
    )
}

export const getOrder = async (
    orderId: string,
): Promise<CreativehubOrderSummary> =>
    request<CreativehubOrderSummary>({
        method: "GET",
        path: `/orders/${encodeURIComponent(orderId)}`,
    })

export const quoteOrder = async ({
    items,
    deliveryCountryCode,
}: {
    items: CreativehubOrderItem[]
    deliveryCountryCode: string
}) =>
    request<Record<string, unknown>>({
        method: "POST",
        path: "/orders/quote",
        body: { items, delivery_country_code: deliveryCountryCode },
    })

export const createOrder = async ({
    items,
    delivery,
    externalReference,
    idempotencyKey,
}: {
    items: CreativehubOrderItem[]
    delivery: CreativehubDelivery
    externalReference: string
    idempotencyKey: string
}) =>
    request<{
        order_id: string
        order_number: string
        external_reference: string | null
        [key: string]: unknown
    }>({
        method: "POST",
        path: "/orders",
        body: { items, ...delivery, external_reference: externalReference },
        headers: { "Idempotency-Key": idempotencyKey },
    })
