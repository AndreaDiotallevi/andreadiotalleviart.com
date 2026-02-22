import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm"

const ssmClient = new SSMClient({ region: process.env.AWS_REGION })

const getParameterValueFromExtension = async ({
    name,
    withDecryption,
}: {
    name: string
    withDecryption: boolean
}): Promise<string | undefined> => {
    const useParametersAndSecretsExtension =
        process.env.USE_PARAMETERS_SECRETS_EXTENSION === "true"

    if (!useParametersAndSecretsExtension || !process.env.AWS_SESSION_TOKEN) {
        return undefined
    }

    const extensionPort =
        process.env.PARAMETERS_SECRETS_EXTENSION_HTTP_PORT ?? "2773"

    const queryParams = new URLSearchParams({
        name,
        withDecryption: withDecryption ? "true" : "false",
    })

    const endpoint = `http://localhost:${extensionPort}/systemsmanager/parameters/get/?${queryParams.toString()}`

    try {
        const response = await fetch(endpoint, {
            headers: {
                "X-Aws-Parameters-Secrets-Token": process.env.AWS_SESSION_TOKEN,
            },
        })

        if (!response.ok) {
            throw new Error(
                `Parameters and Secrets extension responded with status code ${response.status}`
            )
        }

        const extensionResponse = (await response.json()) as {
            Parameter?: { Value?: string }
        }

        return extensionResponse.Parameter?.Value
    } catch (error) {
        console.warn(
            `Failed to read ${name} from the Parameters and Secrets extension, falling back to SSM SDK.`,
            error
        )

        return undefined
    }
}

export const getParameterValue = async <T>({
    name,
    withDecryption = false,
}: {
    name: string
    withDecryption?: boolean
}): Promise<T> => {
    const extensionValue = await getParameterValueFromExtension({
        name,
        withDecryption,
    })

    if (extensionValue !== undefined) {
        return extensionValue as T
    }

    const getParameterCommand = new GetParameterCommand({
        Name: name,
        WithDecryption: withDecryption,
    })

    console.log(`Getting ${name} parameter value...`)
    const { Parameter } = await ssmClient.send(getParameterCommand)

    if (!Parameter?.Value) {
        throw new Error("No parameter")
    }

    return Parameter.Value as T
}
