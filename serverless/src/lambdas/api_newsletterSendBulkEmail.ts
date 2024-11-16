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

export const handler = async ({ templateName }: { templateName: string }) => {
    const myEmail = await getParameterValue<string>({
        name: "EMAIL_ANDREA",
    })

    const { contacts } = await newsletterListContacts()

    const batchSize = 50

    const contactBatches = chunkArray(contacts, batchSize)

    for (const batch of contactBatches) {
        await sendBulkEmail({
            FromEmailAddress: myEmail,
            DefaultContent: {
                Template: {
                    TemplateName: templateName,
                    TemplateData: JSON.stringify({}),
                    // Headers: [
                    //     {
                    //         Name: "List-Unsubscribe",
                    //         Value: `<https://www.andreadiotalleviart.com/?address=x&topic=GeneralUpdates>, <mailto: unsubscribe@nutrition.co?subject=TopicUnsubscribe>`,
                    //     },
                    //     {
                    //         Name: "List-Unsubscribe-Post",
                    //         Value: "List-Unsubscribe=One-Click",
                    //     },
                    // ],
                },
            },
            BulkEmailEntries: batch.map(contact => ({
                Destination: {
                    ToAddresses: [contact.EmailAddress!],
                },
            })),
        })
    }

    return "OK"
}
