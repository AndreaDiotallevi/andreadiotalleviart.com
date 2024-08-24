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
