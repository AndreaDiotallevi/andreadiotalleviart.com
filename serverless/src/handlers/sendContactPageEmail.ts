import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

import { sendEmail } from "../services/ses"
import { getParameterValue } from "../services/ssm"

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
            "Access-Control-Allow-Headers": "Content-Type, X-Api-Key",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
        },
    }
}
