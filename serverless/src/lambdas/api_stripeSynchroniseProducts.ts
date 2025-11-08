import { APIGatewayProxyResult } from "aws-lambda"

import { stripeSynchroniseProducts } from "../actions/stripe_synchroniseProducts"
import { purgeNetlifyCache } from "../actions/netlify_purgeCache"
import { deleteObject } from "../actions/s3_deleteObject"
import { cleanupCheckoutSessionsWithInactivePrices } from "../actions/stripe_cleanupCheckoutSessions"

export const handler = async (): Promise<APIGatewayProxyResult> => {
    await stripeSynchroniseProducts()
    await cleanupCheckoutSessionsWithInactivePrices()
    await purgeNetlifyCache()

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
