import { createOrder } from "../services/prodigi"
// import { EventBridgeEvent } from "aws-lambda"

export const handler = async (event: {}) => {
    console.log(event)
    await createOrder()
}
