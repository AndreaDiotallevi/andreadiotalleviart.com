import { APIGatewayProxyResult } from "aws-lambda"

import { stripeSynchroniseProducts } from "../services/stripe"

export const handler = async (): Promise<APIGatewayProxyResult> => {
    await stripeSynchroniseProducts()

    return {
        statusCode: 200,
        body: "OK",
        // headers: {
        //     "Access-Control-Allow-Headers": "Content-Type, X-Api-Key",
        //     "Access-Control-Allow-Origin": "*",
        //     "Access-Control-Allow-Methods": "*",
        // },
    }
}
