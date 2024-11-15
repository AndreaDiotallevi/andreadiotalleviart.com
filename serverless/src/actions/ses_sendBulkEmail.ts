import {
    SESClient,
    SendBulkTemplatedEmailCommand,
    SendBulkTemplatedEmailCommandInput,
} from "@aws-sdk/client-ses"

const sesClient = new SESClient({ region: process.env.AWS_REGION })

export const sendBulkEmail = async (
    input: SendBulkTemplatedEmailCommandInput
) => {
    try {
        console.log("Sending bulk email...")
        const sendEmailCommand = new SendBulkTemplatedEmailCommand({
            ...input,
            Source: `Andrea Diotallevi Art <${input.Source}>`,
        })

        return await sesClient.send(sendEmailCommand)
    } catch (error) {
        console.error(error)
        throw error
    }
}
