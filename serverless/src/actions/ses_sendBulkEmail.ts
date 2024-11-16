import {
    SESv2Client,
    SendBulkEmailCommand,
    SendBulkEmailCommandInput,
} from "@aws-sdk/client-sesv2"

const sesClient = new SESv2Client({ region: process.env.AWS_REGION })

export const sendBulkEmail = async (input: SendBulkEmailCommandInput) => {
    try {
        console.log("Sending bulk email...")
        const sendEmailCommand = new SendBulkEmailCommand({
            ...input,
            FromEmailAddress: `Andrea Diotallevi Art <${input.FromEmailAddress}>`,
        })

        return await sesClient.send(sendEmailCommand)
    } catch (error) {
        console.error(error)
        throw error
    }
}
