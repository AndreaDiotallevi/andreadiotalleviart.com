import {
    SNSClient,
    PublishCommand,
    PublishCommandInput,
} from "@aws-sdk/client-sns"

const snsClient = new SNSClient({ region: process.env.AWS_REGION })

export const publishMessage = async (input: PublishCommandInput) => {
    try {
        const publishCommand = new PublishCommand(input)
        console.log("Publishing message...")
        const response = await snsClient.send(publishCommand)
        console.log(response)
    } catch (caugh) {
        console.error(caugh)
    }
}
