import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3"

const s3Client = new S3Client({ region: process.env.AWS_REGION })

export const deleteObject = async (key: string) => {
    const bucket = process.env.BUCKET
    if (!bucket) {
        throw new Error("BUCKET env var is required")
    }

    const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
    })

    return s3Client.send(command)
}
