import {
    SESClient,
    SendTemplatedEmailCommand,
    SendTemplatedEmailCommandInput,
} from "@aws-sdk/client-ses"

const sesClient = new SESClient({ region: process.env.AWS_REGION })

export const sendEmail = async (input: SendTemplatedEmailCommandInput) => {
    try {
        const sendEmailCommand = new SendTemplatedEmailCommand(input)

        return await sesClient.send(sendEmailCommand)
    } catch (error) {
        console.error(error)
        throw error
    }
}
