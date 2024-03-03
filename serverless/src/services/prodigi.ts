import Stripe from "stripe"
import { getParameterValue } from "./ssm"

export const createOrder = async ({
    customerDetails,
    shippingDetails,
    lineItems,
    imageUrl,
}: {
    customerDetails: Stripe.Checkout.Session["customer_details"]
    shippingDetails: Stripe.Checkout.Session["shipping_details"]
    lineItems: Stripe.Checkout.Session["line_items"]
    imageUrl: string
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

        const url = "https://api.sandbox.prodigi.com/v4.0/Orders/"

        const requestBody = {
            merchantReference: "PHOTOBOOK-SAMPLE",
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
                name: customerDetails.name + "6",
            },
            items: lineItems.data.map(item => ({
                merchantReference: "A4 Hardback",
                sku: "GLOBAL-HPR-A3", // Hahnemühle Photo Rag, 29.7x42 cm / 11.7x16.5" (A3)
                copies: item.quantity,
                sizing: "fillPrintArea",
                assets: [
                    {
                        printArea: "Default",
                        // url: "https://andreadiotalleviart-sandbox.s3.eu-west-2.amazonaws.com/flames-A3.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA4WRLP7CYEHVY3TIX%2F20240302%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240302T171328Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFIaCWV1LXdlc3QtMiJHMEUCIQDLooxnSQiBXGnEMXe%2FKEJgp%2B89UiwT%2BEKm%2Bwbf7KsMxwIgb5uS%2FoLoSxTAWkhEkxjtZ3C84NtTlK7Kv%2FYMPmFsd%2BUqoQMIShAAGgw4NzMwNDMzMjcxNTIiDEvXN66RDOxa%2FKD2Nir%2BAlJKHiGUA0rMM6A2vE2rApQXG%2BnKnyJ42zuBNNl%2FLG5QCJcL6UM%2BiRq9O7cza3NVG%2Buj4dCq%2Bwl35YZKX9ND44Vwa3OLUGsxA3sWmQwwbSp18lpm166nV95SAKng3pva8w%2FH2BBYBjhXlktrLXKumb8OiVHHX5SnHEmsgveJRhEu0i81G60ao5St4pH1yZgo8JCAUyjd2t8UfJi440Bw%2F%2FxOTuWmA7dQGVeREiNnKsEe9REckgaSQNzHHBgtgKoPW4D4hA3N1ohFZBiFB990vCAy%2FYjpjrMyW0tIPXT8FoYEzHeY4TLZiFNL9Wpv1B5kCbk1EAMM8dlFqBVyT1odSTf%2BZjsUbiCB5YaiNJViv9X5GDOn5s8D%2FdeHShbzZOUxkCRWszSH1Mte8O8Es3dQMSNSwzNRm8hgaOXjlEJoVzy%2BJtZtTt%2Bd%2B5AWhEjERO4NaSkVZJoCgKwpFT0ZHMjxJNph%2BrsabXoNXW4GtpEUYSBy9JYkSXRNy0v7ysgDy20wt7yNrwY6nQHP%2FzYPjLULmpluFTbPnY1muwrCXebx%2FW1woXijBTecB9ycuxgjxOF2gFPRmi52Q3Er4XvWb5IUTMzkClf52bsen%2Fag4Lh3EFd9iVJtO9sITdAtNzCzZ9JAWD8LtkBrADULDRR1kk6TAusXNXjmQUzrJezoTaMZrGcZdmWLbWm3xSNE1Wk3F7gODVP3YC%2BKbk6mBshH37j419EVUQ8j&X-Amz-Signature=9eed2e1ed1dd0cb771795677be0039109b4ceba05fffbaa1bfe09df89613aaff&X-Amz-SignedHeaders=host&x-id=GetObject",
                        // url: imageUrl,
                        url: "https://epfileconcierge.blob.core.windows.net/concierge/A4%20hardcover_update_new.pdf",
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
        console.log(typeof response)
        console.log(response.body)
        console.log(Object.entries(response))
        console.log(JSON.stringify(response))

        if (!response.ok) {
            throw new Error("Failed to create order")
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}
