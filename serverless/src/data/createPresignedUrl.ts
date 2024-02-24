import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const client = new S3Client({ region: process.env.AWS_REGION })

export const createPresignedUrl = async () => {
    try {
        const command = new GetObjectCommand({
            Bucket: process.env.BUCKET,
            Key: "flames-A3.png",
        })

        const url = await getSignedUrl(client, command, { expiresIn: 3600 })

        return { url }
    } catch (error) {
        console.error(error)
        throw error
    }
}
