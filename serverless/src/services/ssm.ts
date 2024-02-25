import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm"

const ssmClient = new SSMClient({ region: process.env.AWS_REGION })

export const getParameterValue = async <T>({
    name,
}: {
    name: string
}): Promise<T> => {
    const getParameterCommand = new GetParameterCommand({
        Name: name,
    })

    const { Parameter } = await ssmClient.send(getParameterCommand)

    if (!Parameter?.Value) {
        throw new Error("No parameter")
    }

    return Parameter.Value as T
}
