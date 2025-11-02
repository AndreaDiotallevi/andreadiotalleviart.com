import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const s3Client = new S3Client({ region: process.env.AWS_REGION })

export const putObjectText = async (
    key: string,
    text: string,
    options?: { contentType?: string; cacheControl?: string }
) => {
    const bucket = process.env.BUCKET
    if (!bucket) {
        throw new Error("BUCKET env var is required")
    }

    return s3Client.send(
        new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: text,
            ContentType: options?.contentType,
            CacheControl: options?.cacheControl,
        })
    )
}
