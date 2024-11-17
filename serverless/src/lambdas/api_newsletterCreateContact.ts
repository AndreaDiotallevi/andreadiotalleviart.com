import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

import { newsletterCreateContact } from "../actions/ses_createContact"
import { sendEmail } from "../actions/ses_sendEmail"
import { getParameterValue } from "../actions/ssm_getParameterValue"

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const { email } = JSON.parse(event.body as string) as { email: string }
    const { error } = await newsletterCreateContact({ email })

    const myEmail = await getParameterValue<string>({
        name: "EMAIL_ANDREA",
    })

    const promotionCode = await getParameterValue<string>({
        name: "NEWSLETTER_PROMOTION_CODE",
    })

    await sendEmail({
        FromEmailAddress: myEmail,
        Destination: {
            ToAddresses: [email],
        },
        Content: {
            Template: {
                TemplateName: process.env.NEWSLETTER_EMAIL_TEMPLATE_NAME,
                TemplateData: JSON.stringify({ promotionCode }),
            },
        },
        ListManagementOptions: {
            ContactListName: process.env.NEWSLETTER_CONTACT_LIST_NAME,
            TopicName: process.env.NEWSLETTER_TOPIC_NAME,
        },
    })

    return {
        statusCode: 200,
        body: JSON.stringify({ success: true, error: error?.name }),
        headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
        },
    }
}
