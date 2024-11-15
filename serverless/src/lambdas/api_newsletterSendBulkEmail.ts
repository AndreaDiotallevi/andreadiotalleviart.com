import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

import { getParameterValue } from "../actions/ssm_getParameterValue"
import { sendBulkEmail } from "../actions/ses_sendBulkEmail"
import { newsletterListContacts } from "../actions/ses_listContacts"

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks = []
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize))
    }
    return chunks
}

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const { templateName } = JSON.parse(event.body as string) as {
        templateName: string
    }

    const myEmail = await getParameterValue<string>({
        name: "EMAIL_ANDREA",
    })

    const { contacts } = await newsletterListContacts()

    const batchSize = 50

    const contactBatches = chunkArray(contacts, batchSize)

    for (const batch of contactBatches) {
        await sendBulkEmail({
            Source: myEmail,
            Destinations: batch.map(contact => ({
                Destination: { ToAddresses: [contact.EmailAddress!] },
            })),
            DefaultTemplateData: JSON.stringify({}),
            Template: templateName,
        })
    }

    return {
        statusCode: 200,
        body: JSON.stringify("OK"),
        headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
        },
    }
}
