import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"

const s3Client = new S3Client({ region: process.env.AWS_REGION })

export const getObjectText = async (key: string): Promise<string> => {
    const bucket = process.env.BUCKET
    if (!bucket) {
        throw new Error("BUCKET env var is required")
    }

    const response = await s3Client.send(
        new GetObjectCommand({ Bucket: bucket, Key: key })
    )

    const body = response.Body as any
    return await body.transformToString()
}
