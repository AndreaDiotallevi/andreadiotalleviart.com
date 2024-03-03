import { createPresignedUrl } from "../services/s3"

export type CreatePresignedUrlResponse = {
    url: string
}

export const handler = async () => {
    const { url } = await createPresignedUrl()

    return {
        url,
    }
}
