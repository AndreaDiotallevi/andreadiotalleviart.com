import { getParameterValue } from "../actions/ssm_getParameterValue"
import { newsletterListContacts } from "../actions/ses_listContacts"
import { sendEmail } from "../actions/ses_sendEmail"

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const handler = async ({ templateName }: { templateName: string }) => {
    const myEmail = await getParameterValue<string>({
        name: "EMAIL_ANDREA",
    })

    const promotionCode = await getParameterValue<string>({
        name: "NEWSLETTER_PROMOTION_CODE",
    })

    const { contacts } = await newsletterListContacts()

    const batchSize = 5
    const sleepTime = 60000

    for (let i = 0; i < contacts.length; i += batchSize) {
        const batch = contacts.slice(i, i + batchSize)

        await Promise.all(
            batch.map(async contact => {
                await sendEmail({
                    FromEmailAddress: myEmail,
                    Destination: {
                        ToAddresses: [contact.EmailAddress!],
                    },
                    Content: {
                        Template: {
                            TemplateName: "NewsletterDiscountEmailTemplate",
                            TemplateData: JSON.stringify({ promotionCode }),
                        },
                    },
                    ListManagementOptions: {
                        ContactListName:
                            process.env.NEWSLETTER_CONTACT_LIST_NAME,
                        TopicName: process.env.NEWSLETTER_TOPIC_NAME,
                    },
                })
            })
        )

        if (i + batchSize < contacts.length) {
            console.log(
                `Sent batch of ${batch.length} emails, sleeping for 1 minute...`
            )
            await sleep(sleepTime)
        }
    }

    return "OK"
}
