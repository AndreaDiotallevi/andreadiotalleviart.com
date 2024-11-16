import {
    SESv2Client,
    SendEmailCommand,
    SendEmailCommandInput,
} from "@aws-sdk/client-sesv2"

const sesClient = new SESv2Client({ region: process.env.AWS_REGION })

export const sendEmail = async (input: SendEmailCommandInput) => {
    try {
        console.log("Sending email...")
        const sendEmailCommand = new SendEmailCommand({
            ...input,
            FromEmailAddress: `Andrea Diotallevi Art <${input.FromEmailAddress}>`,
        })

        return await sesClient.send(sendEmailCommand)
    } catch (error) {
        console.error(error)
        throw error
    }
}
