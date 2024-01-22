import { SQSEvent, SQSRecord } from "aws-lambda"

import { sendEmail } from "../data"

export const handler = async (event: SQSEvent): Promise<void> => {
    try {
        for (const record of event.Records) {
            console.log(record)
            const { error } = await sendEmail()

            if (error) {
                console.log("Error processing SQS event record")
                console.error(error)

                throw new Error("Could not process SQS event record")
            }
        }
    } catch (error) {
        console.log("Error processing SQS event")
        console.error(error)

        throw new Error("Could not process SQS event")
    }
}
