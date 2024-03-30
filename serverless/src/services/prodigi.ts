import Stripe from "stripe"
import { getParameterValue } from "./ssm"

const fileName = "flames-A3.png"

type OrderStage = "Draft" | "InProgress" | "Complete"
type OrderItemStatus = "NotYetDownloaded" | "Ok"
type ProgressStatus = "NotStarted" | "InProgress" | "Complete"

export type ProdigiEvent = {
    specversion: string
    type:
        | `com.prodigi.order.status.stage.changed#${OrderStage}`
        | "com.prodigi.order.shipments.shipment#Complete"
    source: string
    id: string
    time: string
    datacontenttype: string
    subject: string
    data: {
        order: {
            id: string
            created: string
            lastUpdated: string
            callbackUrl: string | null
            merchantReference: string
            shippingMethod: string
            idempotencyKey: string | null
            status: {
                stage: OrderStage
                issues: string[]
                details: {
                    downloadAssets: ProgressStatus
                    printReadyAssetsPrepared: ProgressStatus
                    allocateProductionLocation: ProgressStatus
                    inProduction: ProgressStatus
                    shipping: ProgressStatus
                }
            }
            charges: {
                id: string
                prodigiInvoiceNumber: string | null
                totalCost: {
                    amount: string
                    currency: string
                }
                totalTax: {
                    amount: string
                    currency: string
                }
                items: {
                    id: string
                    itemId: string | null
                    cost: {
                        amount: string
                        currency: string
                    }
                    shipmentId: string | null
                    chargeType: string
                }[]
            }[]
            shipments: {
                id: string
                dispatchDate: string
                carrier: {
                    name: string
                    service: string
                }
                fulfillmentLocation: {
                    countryCode: string
                    labCode: string
                }
                tracking: {
                    number: string
                    url: string
                }
                items: {
                    itemId: string
                }[]
                status: string
            }[]
            recipient: {
                name: string
                email: string | null
                phoneNumber: string | null
                address: {
                    line1: string
                    line2: string | null
                    postalOrZipCode: string
                    countryCode: string
                    townOrCity: string
                    stateOrCounty: string | null
                }
            }
            items: {
                id: string
                status: OrderItemStatus
                merchantReference: string
                sku: string
                copies: number
                sizing: string
                thumbnailUrl: string | null
                attributes: Record<string, any>
                assets: {
                    id: string
                    status: "InProgress" | "Complete"
                    printArea: string
                    url: string
                    md5Hash: string | null
                    thumbnailUrl: string | null
                }[]
                recipientCost: {
                    amount: string
                    currency: string
                } | null
                correlationIdentifier: string
            }[]
            packingSlip: {
                url: string | null
                status: string | null
            } | null
            metadata: Record<string, any>
        }
        traceParent: string
    }
}

export const createOrder = async ({
    customerDetails,
    shippingDetails,
    lineItems,
}: {
    customerDetails: Stripe.Checkout.Session["customer_details"]
    shippingDetails: Stripe.Checkout.Session["shipping_details"]
    lineItems: Stripe.Checkout.Session["line_items"]
}) => {
    try {
        if (!shippingDetails?.address) {
            throw new Error("No shipping details")
        }
        if (!customerDetails) {
            throw new Error("No customer details")
        }
        if (!lineItems) {
            throw new Error("No line items")
        }

        // 3507x4960px

        const prodigiApiKey = await getParameterValue<string>({
            name: "PRODIGI_API_KEY",
        })

        const url = `${process.env.PRODIGI_API_URL}/v4.0/Orders/`

        const requestBody = {
            merchantReference: "TBC",
            shippingMethod: "Standard",
            recipient: {
                address: {
                    line1: shippingDetails.address.line1,
                    line2: shippingDetails.address.line2 || null,
                    postalOrZipCode: shippingDetails.address.postal_code,
                    countryCode: shippingDetails.address.country,
                    townOrCity: shippingDetails.address.city,
                    stateOrCounty: shippingDetails.address.state || null, // Empty string breaks it
                },
                name: customerDetails.name + "7",
            },
            items: lineItems.data.map(item => ({
                merchantReference: "TBC",
                sku: "GLOBAL-HPR-A3", // Hahnemühle Photo Rag, 29.7x42 cm / 11.7x16.5" (A3)
                copies: item.quantity,
                sizing: "fillPrintArea",
                assets: [
                    {
                        printArea: "Default",
                        url: `https://${process.env.BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
                    },
                ],
            })),
            metadata: {},
        }

        console.log(JSON.stringify(requestBody))

        const options = {
            method: "POST",
            headers: {
                "X-API-Key": prodigiApiKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        }

        const response = await fetch(url, options)

        if (!response.ok) {
            throw new Error("Failed to create order")
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}
