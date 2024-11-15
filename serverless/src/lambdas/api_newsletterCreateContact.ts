import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

import { newsletterCreateContact } from "../actions/ses_createContact"
import { sendEmail } from "../actions/ses_sendEmail"
import { getParameterValue } from "../actions/ssm_getParameterValue"

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const { email } = JSON.parse(event.body as string) as { email: string }
    const { error } = await newsletterCreateContact({ email })

    const emailSource = await getParameterValue<string>({
        name: "EMAIL_ANDREA",
    })

    const promotionCode = await getParameterValue<string>({
        name: "NEWSLETTER_PROMOTION_CODE",
    })

    await sendEmail({
        Source: emailSource,
        Destination: {
            ToAddresses: [email],
        },
        Template: "NewsletterWelcomeBeforeLaunchEmailTemplate",
        TemplateData: JSON.stringify({ promotionCode }),
    })

    const statusCode = error ? 500 : 200
    const body = error
        ? JSON.stringify({ error, success: false })
        : JSON.stringify({ success: true })

    return {
        statusCode,
        body,
        headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
        },
    }
}
