import { APIGatewayProxyEvent } from "aws-lambda"
import { ProdigiEvent } from "../services/prodigi"
import { putEvent } from "../services/events"

export const handler = async (event: APIGatewayProxyEvent) => {
    try {
        const { body } = event
        console.log(JSON.stringify(body))

        const prodigiEvent = JSON.parse(body || "") as ProdigiEvent

        const { Entries } = await putEvent({
            source: "prodigi",
            detailType: "OrderCompleted",
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
