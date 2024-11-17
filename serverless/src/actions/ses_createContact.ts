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
    } catch (caught) {
        if (
            caught instanceof Error &&
            caught.name === "AlreadyExistsException"
        ) {
            const messageRejectedError = caught
            console.error(messageRejectedError)
            return { error: messageRejectedError }
        }
        throw caught
    }
}
