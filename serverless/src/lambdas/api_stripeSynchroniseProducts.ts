import { APIGatewayProxyResult } from "aws-lambda"

import { stripeSynchroniseProducts } from "../actions/stripe_synchroniseProducts"

export const handler = async (): Promise<APIGatewayProxyResult> => {
    await stripeSynchroniseProducts()

    return {
        statusCode: 200,
        body: "OK",
    }
}
