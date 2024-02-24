import { createOrder } from "../data"
import { CreatePresignedUrlResponse } from "./createPresignedUrl"

export const handler = async (event: CreatePresignedUrlResponse) => {
    console.log(event)
    await createOrder()
}
