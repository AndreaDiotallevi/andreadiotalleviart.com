import { SQSEvent, SQSRecord } from "aws-lambda"

import { sendEmail } from "../data"

export const handler = async (event: SQSEvent): Promise<void> => {
    console.log(event)
    // for (const record of event.Records) {

    // }
    // try {
    //     for (const record of event.Records) {
    //         // Process each SQS message
    //         const { error } = await sendEmail()
    //     }
    // } catch (error) {
    //     console.error("Error processing SQS event:", error)
    //     throw error // Let Lambda retry the event
    // }

    // const { error } = await sendEmail()

    // const statusCode = error ? 500 : 200

    // const body = error ? JSON.stringify({ error }) : JSON.stringify("OK")

    // return {
    //     statusCode,
    //     body,
    //     headers: {
    //         "Access-Control-Allow-Headers": "Content-Type, X-Api-Key",
    //         "Access-Control-Allow-Origin": "*",
    //         "Access-Control-Allow-Methods": "*",
    //     },
    // }
}
