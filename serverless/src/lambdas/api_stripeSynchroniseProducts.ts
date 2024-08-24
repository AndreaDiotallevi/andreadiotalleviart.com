import { APIGatewayProxyResult } from "aws-lambda"

import { stripeSynchroniseProducts } from "../actions/stripe_synchroniseProducts"

export const handler = async (): Promise<APIGatewayProxyResult> => {
    if (process.env.ENVIRONMENT !== "production") {
        // Required until Creativehub updates the SSL certificate for the sandbox API environment (which has expired)
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
    }

    await stripeSynchroniseProducts()

    return {
        statusCode: 200,
        body: "OK",
    }
}
