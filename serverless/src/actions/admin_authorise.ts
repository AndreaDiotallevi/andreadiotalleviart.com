import { APIGatewayProxyEvent } from "aws-lambda"

export const isAuthorisedAdminRequest = (
    event: APIGatewayProxyEvent,
): boolean => {
    const adminSecret = process.env.ADMIN_API_SECRET
    const providedSecret =
        event.headers?.["X-Admin-Secret"] ?? event.headers?.["x-admin-secret"]

    return Boolean(adminSecret) && providedSecret === adminSecret
}
