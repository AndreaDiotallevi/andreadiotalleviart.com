import { APIGatewayProxyEvent } from "aws-lambda"

export const handler = async (event: APIGatewayProxyEvent) => {
    console.log(event)

    return {
        statusCode: 200,
    }
}
