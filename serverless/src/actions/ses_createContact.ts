import { SESv2Client, CreateContactCommand } from "@aws-sdk/client-sesv2"

const sesClient = new SESv2Client({ region: process.env.AWS_REGION })

export const newsletterCreateContact = async ({ email }: { email: string }) => {
    try {
        const input = {
            ContactListName: process.env.NEWSLETTER_CONTACT_LIST_NAME,
            EmailAddress: email,
        }
        const command = new CreateContactCommand(input)
        console.log("Creating newsletter contact...")
        const response = await sesClient.send(command)
        console.log(response)
        return { error: null }
    } catch (error) {
        console.error(error)
        const awsError = error as unknown as { name: string }
        return { error: awsError.name || "Unknown error" }
    }
}
