import { createPresignedUrl } from "../data"

export type CreatePresignedUrlResponse = {
    url: string
}

export const handler = async (): Promise<CreatePresignedUrlResponse> => {
    const { url } = await createPresignedUrl()

    return {
        url,
    }
}
