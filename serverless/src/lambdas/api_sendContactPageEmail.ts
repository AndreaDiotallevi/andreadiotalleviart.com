import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

import { getParameterValue } from "../actions/ssm_getParameterValue"
import { sendEmail } from "../actions/ses_sendEmail"

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const { name, email, subject, message } = JSON.parse(
        event.body as string
    ) as {
        name: string
        email: string
        subject: string
        message: string
    }

    const myEmail = await getParameterValue<string>({
        name: "EMAIL_SUPPORT",
    })

    await sendEmail({
        Source: myEmail,
        Destination: {
            ToAddresses: [myEmail],
        },
        Template: "ContactPageEmailTemplate",
        TemplateData: JSON.stringify({ name, email, subject, message }),
    })

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
