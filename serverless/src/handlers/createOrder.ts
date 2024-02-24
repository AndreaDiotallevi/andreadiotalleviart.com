import { CreatePresignedUrlResponse } from "./createPresignedUrl"

export const handler = async (event: CreatePresignedUrlResponse) => {
    console.log(event)
}
