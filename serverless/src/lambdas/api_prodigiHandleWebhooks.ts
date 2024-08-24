import { APIGatewayProxyEvent } from "aws-lambda"

import { putEvent } from "../actions/eventbridge_putEvent"

import { ProdigiEvent } from "../types/prodigi"

export const handler = async (event: APIGatewayProxyEvent) => {
    try {
        const { body } = event
        console.log(JSON.stringify(body))

        const prodigiEvent = JSON.parse(body || "") as ProdigiEvent

        const { Entries } = await putEvent({
            source: "prodigi",
            detailType: prodigiEvent.type,
            event: prodigiEvent,
        })

        return {
            statusCode: 200,
            body: JSON.stringify(Entries),
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}
