import { APIGatewayProxyResult } from "aws-lambda"

import { stripeSynchroniseProducts } from "../actions/stripe_synchroniseProducts"
import { purgeNetlifyCache } from "../actions/netlify_purgeCache"
import { deleteObject } from "../actions/s3_deleteObject"

export const handler = async (): Promise<APIGatewayProxyResult> => {
    await stripeSynchroniseProducts()

    await purgeNetlifyCache()

    // Purge S3 products cache
    try {
        console.log("Purging S3 cache for Stripe products...")
        await deleteObject("cache/stripe_products.json")
    } catch (error) {
        console.error("Failed to purge S3 cache", error)
    }

    return {
        statusCode: 200,
        body: "OK",
    }
}
