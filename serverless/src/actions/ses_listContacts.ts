import {
    SESv2Client,
    ListContactsCommand,
    Contact,
} from "@aws-sdk/client-sesv2"

const sesClient = new SESv2Client({ region: process.env.AWS_REGION })

export const newsletterListContacts = async (): Promise<{
    contacts: Contact[]
}> => {
    try {
        const input = {
            ContactListName: process.env.NEWSLETTER_CONTACT_LIST_NAME,
            // Filter: {
            // ListContactsFilter
            FilteredStatus: "OPT_IN",
            // TopicFilter: {
            //     // TopicFilter
            //     TopicName: "STRING_VALUE",
            //     UseDefaultIfPreferenceUnavailable: true || false,
            // },
            // },
            // PageSize: Number("int"),
            // NextToken: "STRING_VALUE",
        }
        const command = new ListContactsCommand(input)
        console.log("Listing newsletter contact list...")
        const response = await sesClient.send(command)
        console.log(response)
        return { contacts: response.Contacts || [] }
    } catch (error) {
        console.error(error)
        throw error
    }
}
