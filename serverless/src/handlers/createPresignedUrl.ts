import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

import { createPresignedUrl } from "../data"

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const { url, error } = await createPresignedUrl()

    const statusCode = error ? 500 : 200

    const body = error ? JSON.stringify({ error }) : JSON.stringify({ url })

    return {
        statusCode,
        body,
    }
}
