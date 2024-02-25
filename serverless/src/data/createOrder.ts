import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm"

const ssmClient = new SSMClient({ region: process.env.AWS_REGION })

export const createOrder = async () => {
    try {
        const getParameterCommand = new GetParameterCommand({
            Name: "PRODIGI_API_KEY",
        })

        const { Parameter } = await ssmClient.send(getParameterCommand)
        const apiKey = Parameter?.Value as string

        const url = "https://api.sandbox.prodigi.com/v4.0/Orders/"

        const requestBody = {
            merchantReference: "PHOTOBOOK-SAMPLE",
            shippingMethod: "Standard",
            recipient: {
                address: {
                    line1: "Line 1",
                    line2: "Line 2",
                    postalOrZipCode: "PA34 5TU",
                    countryCode: "GB",
                    townOrCity: "Oban",
                    stateOrCounty: null,
                },
                name: "John Doe",
            },
            items: [
                {
                    merchantReference: "A4 Hardback",
                    sku: "GLOBAL-HPR-A3",
                    copies: 1,
                    sizing: "fillPrintArea",
                    assets: [
                        {
                            printArea: "Default",
                            url: "https://epfileconcierge.blob.core.windows.net/concierge/A4%20hardcover_update_new.pdf",
                        },
                    ],
                },
                {
                    merchantReference: "21 Square Softback",
                    sku: "BOOK-8_3-SQ-SOFT-M",
                    copies: 1,
                    sizing: "fillPrintArea",
                    assets: [
                        {
                            printArea: "Default",
                            url: "https://epfileconcierge.blob.core.windows.net/concierge/Square%2021%20Softcover_update.pdf",
                        },
                    ],
                },
            ],
            metadata: {},
        }

        const options = {
            method: "POST",
            headers: {
                "X-API-Key": apiKey,
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
