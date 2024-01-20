import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm"

const sesClient = new SESClient({ region: process.env.AWS_REGION })
const ssmClient = new SSMClient({ region: process.env.AWS_REGION })

export const sendEmail = async () => {
    try {
        const getParameterCommand1 = new GetParameterCommand({
            Name: "EMAIL_SOURCE",
        })
        const { Parameter: param1 } = await ssmClient.send(getParameterCommand1)
        const sourceEmail = param1?.Value as string

        const getParameterCommand2 = new GetParameterCommand({
            Name: "EMAIL_DESTINATION",
        })
        const { Parameter: param2 } = await ssmClient.send(getParameterCommand2)
        const destinationEmail = param2?.Value as string

        const sendEmailCommand = new SendEmailCommand({
            Source: sourceEmail,
            Destination: {
                ToAddresses: [destinationEmail],
            },
            Message: {
                Subject: {
                    Data: "Hello, World!",
                },
                Body: {
                    Text: {
                        Data: "This is a simple email sent using AWS SES.",
                    },
                },
            },
        })
        const response = await sesClient.send(sendEmailCommand)
        console.log(response)

        return { error: null }
    } catch (error) {
        console.log("Error sending email")
        console.log(error)
        const errorMessage = "Could not send email"

        return {
            error: errorMessage,
        }
    }
}
