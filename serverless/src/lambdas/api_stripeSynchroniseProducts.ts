import { APIGatewayProxyResult } from "aws-lambda"

import { stripeSynchroniseProducts } from "../actions/stripe_synchroniseProducts"
import { purgeNetlifyCache } from "../actions/netlify_purgeCache"

export const handler = async (): Promise<APIGatewayProxyResult> => {
    await stripeSynchroniseProducts()

    await purgeNetlifyCache()

    return {
        statusCode: 200,
        body: "OK",
    }
}
